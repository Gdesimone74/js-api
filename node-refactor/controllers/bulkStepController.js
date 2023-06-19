const models  = require('../models');
const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');


module.exports = {

   createBulkSteps(req, res) {
    if (!req.decoded || !req.decoded.user){
        return res.status(400).send({
          message: 'User Not Found',
        });
      }

    const listingId = req.params.listingId;

    try {
      const listing = models.Listing.findByPk(listingId);
      if (!listing) {
        return res.status(400).send({
            message: 'Listing Not Found',
          });
      }

      if (listing.subsidiaryId != req.decoded.user.subsidiaryId && !req.decoded.user.authorities.includes("ROLE_EMPLOYEE") ) {
        return res.status(403).send({
          message: 'Listing Not Found',
        });
      }

    if (!req.file) {
      return res.status(400).send({
        message: 'CSV file not provided',
      });
    }

    const steps = [];

    const fileBuffer = req.file.buffer;
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
      .on('end', async () => {
        await models.Step.bulkCreate(steps);
        return res.status(200).send({ message: 'CSV process' });
      })
      .on('error', (error) => {

        console.error('Error read the file:', error);
        
        res.status(500).send({ message: 'Error read the file' });
      });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
      }
}
}
