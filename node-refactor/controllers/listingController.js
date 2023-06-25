const models  = require('../models');
const csv = require('csv-parser');
const { Readable } = require('stream');


const selectQuery = () => {
  const select =  `
    SELECT
      "Subsidiary"."id" as "subsidiaryId",
      "Country"."name" as "countryName",
      "Country"."code" as "countryCode",
      COALESCE("Subsidiary"."name", "Company"."name") as "subsidiaryName",
      COALESCE("Subsidiary"."logo", "Company"."logo") as "subsidiaryLogo",
      "Listing"."id",
      "Listing".company_name as "companyName",
      "Listing".company_logo as "companyLogo",
      "Listing"."name",
      "Listing"."description",
      "Listing"."criteria",
      "Listing"."info",
      "Listing"."state",
      "Listing"."gs",
      COALESCE("PlatformListing".platform_listings, 0)::int as "platformListings"

      FROM
        listings AS "Listing"
        LEFT OUTER JOIN subsidiaries AS "Subsidiary" ON "Listing".subsidiary_id = "Subsidiary"."id"
        LEFT OUTER JOIN countries AS "Country" ON "Subsidiary".country_id = "Country"."id"
        LEFT OUTER JOIN companies AS "Company" ON "Subsidiary".company_id = "Company"."id"
      LEFT OUTER JOIN (
        SELECT l.listing_id as "lid", count(*) as platform_listings FROM platform_listings as l
        WHERE l."state" = 'ACTIVE'
      GROUP BY lid) AS "PlatformListing" ON "Listing"."id" = "PlatformListing"."lid"
    `
  return select
}

const findListingById = (listingId) => {
  return models.Listing.findByPk(listingId).then((listing) => {
    if (!listing) {
      throw new Error('Listing Not Found');
    }
    return listing;
  });
};

const checkListingAccess = (listing, decodedUser) => {
  if (
    listing.subsidiaryId != decodedUser.subsidiaryId &&
    !decodedUser.authorities.includes('ROLE_EMPLOYEE')
  ) {
    throw new Error('Listing Not Found');
  }
};

const updateListing = (listing, req) => {
  return listing.update({
    companyName: req.body.companyName || listing.companyName,
    companyLogo: req.body.companyLogo || listing.companyLogo,
    name: req.body.name || listing.name,
    description: req.body.description || listing.description,
    info: req.body.info || listing.info,
    state: req.body.state || listing.state,
    gs: req.body.gs || listing.gs,
    criteria: req.body.criteria || listing.criteria,
  });
};

function getListingSteps(listingId) {
  return models.Step.findAll({
    where: {
      listingId: listingId,
    },
  })
    .catch((error) => {
      console.log(error);
      throw new Error('Error al obtener los steps');
    });
}

const createSteps = (listing, steps) => {
  const bulkCreate = steps.map((step) => ({
    listingId: listing.id,
    flowId: step.flowId,
    name: step.name,
    step: step.step,
  }));

  return models.Step.bulkCreate(bulkCreate);
};

const deleteSteps = (deleted) => {
  return models.Step.destroy({
    where: {
      id: deleted,
    },
  });
};

const updateSteps = (steps) => {
  const changes = steps.filter((step) => step.id > 0);

  const updatePromises = changes.map((step) => {
    return models.Step.update(
      {
        name: step.name,
        step: step.step,
        flowId: step.flowId,
      },
      {
        where: {
          id: step.id,
        },
      }
    );
  });

  return Promise.all(updatePromises);
};

const processCSVFile = (fileBuffer, listingId) => {
  return new Promise((resolve, reject) => {
    const steps = [];
    const readableStream = Readable.from([fileBuffer]);

    readableStream
      .pipe(csv())
      .on('data', (data) => {
        const step = {
          name: data.name,
          step: data.step,
          listingFlow: data.listingFlow,
          listingId: listingId,
        };

        steps.push(step);
      })
      .on('end', () => {
        resolve(steps);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const updateStepFromListing = (listing, cSteps, steps) => {
  const clientSteps = cSteps;
  let deleted = steps;

  for (let i = 0, len = clientSteps.length; i < len; i++) {
    deleted = deleted.filter((step) => step.id !== clientSteps[i].id);
  }
  deleted = deleted.map((step) => step.id);
  console.log('deleted', deleted);

  const newSteps = cSteps.filter((step) => step.id < 0);

  return createSteps(listing, newSteps)
    .then(() => deleteSteps(deleted))
    .then(() => updateSteps(clientSteps))
    .then(() => {
      console.log('Steps updated');
    })
    .catch((error) => {
      console.log(error);
    });
};

function executeQuery(listingId) {
  const requirements = { type: models.sequelize.QueryTypes.SELECT };
  let query = '';
  const select = selectQuery();
  const where = `
    WHERE
      "Listing"."id" = ?
  `;
  requirements.replacements = [listingId];
  query = select + where;

  return models.sequelize.query(query, requirements);
}

function checkUserAuthorization(req, res) {
  if (!req.decoded || !req.decoded.user) {
    return res.status(400).send({
      message: 'User Not Found',
    });
  }
  return Promise.resolve();
}

module.exports = {
  update(req, res) {
    return checkUserAuthorization(req, res)
      .then(() => findListingById(req.params.listingId))
      .then((listing) => {
        checkListingAccess(listing, req.decoded.user);
        return updateListing(listing, req)
          .then((listing) => {
            return getListingSteps(listing.id)
              .then((steps) => {
                updateStepFromListing(listing, req.body.steps, steps);
                return executeQuery(listing.id)
                  .then((listings) => res.status(200).send(listings[0]))
                  .catch((error) => {
                    console.log(error);
                    res.status(400).send(error);
                  });
              })
              .catch((error) => {
                console.log(error);
                res.status(400).send(error);
              });
          })
          .catch((error) => {
            console.log(error);
            res.status(400).send(error);
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },


  get(req, res) {
    findListingById(req.params.listingId)
      .then((listing) => res.json(listing))
      .catch((error) => {
        console.error('Error get liting:', error);
        res.status(500).json({ error: 'server error' });
      });
  },

  createBulkSteps(req, res) {
    return checkUserAuthorization(req, res)
      .then(() => {
        const listingId = req.params.listingId;
  
        return findListingById(listingId)
          .then((listing) => {
            checkListingAccess(listing, req.decoded.user);
  
            if (!req.file) {
              return res.status(400).send({
                message: 'CSV file not provided',
              });
            }

            const fileBuffer = req.file.buffer;
            return processCSVFile(fileBuffer, listingId)
              .then((steps) => {
                return createSteps(listing, steps)
                  .then(() => {
                    res.status(200).send({ message: 'CSV processed successfully' });
                  })
                  .catch((error) => {
                    console.error('Error creating steps:', error);
                    res.status(500).send({ message: 'Error creating steps' });
                  });
              })
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send({ message: 'Server error' });
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send({ message: 'User Not Found' });
      });
  }
};
