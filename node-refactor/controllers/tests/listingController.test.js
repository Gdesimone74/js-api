const models = require('../../models');
const listingController = require('../listingController');

describe('listingController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { listingId: 1 },
      body: {
        companyName: 'New Company',
        companyLogo: 'new-logo.png',
        name: 'New Listing',
        description: 'New Description',
        info: 'New Info',
        state: 'New State',
        gs: 'New GS',
        criteria: 'New Criteria',
        steps: [
          { id: 1, name: 'Step 1', step: 1, flowId: 1 },
          { id: 2, name: 'Step 2', step: 2, flowId: 2 },
          { id: -1, name: 'New Step', step: 3, flowId: 3 },
        ],
      },
      decoded: {
        user: { subsidiaryId: 1, authorities: ['ROLE_EMPLOYEE'] },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    test('should update the listing and return the updated listings', async () => {
      const expectedListings = [{ id: 1, name: 'Updated Listing' }];

      models.Listing.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        companyName: 'Old Company',
        companyLogo: 'old-logo.png',
        name: 'Old Listing',
        description: 'Old Description',
        info: 'Old Info',
        state: 'Old State',
        gs: 'Old GS',
        criteria: 'Old Criteria',
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Listing' }),
      });

      models.Step.findAll = jest.fn().mockResolvedValue([
        { id: 1, name: 'Step 1', step: 1, flowId: 1 },
        { id: 2, name: 'Step 2', step: 2, flowId: 2 },
        { id: 3, name: 'Step 3', step: 3, flowId: 3 },
      ]);

      models.Step.bulkCreate = jest.fn().mockResolvedValue();
      models.Step.destroy = jest.fn().mockResolvedValue();
      models.Step.update = jest.fn().mockResolvedValue();
      models.sequelize.query = jest.fn().mockResolvedValue([expectedListings]);

      await listingController.update(req, res);

      expect(models.Listing.findByPk).toHaveBeenCalledWith(1);
      expect(models.Step.findAll).toHaveBeenCalledWith({
        where: { listingId: 1 },
      });
      expect(models.Step.bulkCreate).toHaveBeenCalledWith([
        {
          listingId: 1,
          flowId: 3,
          name: 'New Step',
          step: 3,
        },
      ]);
      expect(models.Step.update).toHaveBeenCalledTimes(2);
      expect(models.Step.update).toHaveBeenCalledWith(
        { name: 'Step 1', step: 1, flowId: 1 },
        { where: { id: 1 } }
      );
      expect(models.Step.update).toHaveBeenCalledWith(
        { name: 'Step 2', step: 2, flowId: 2 },
        { where: { id: 2 } }
      );
    });

    test('should return 404 if listing not found', async () => {
      models.Listing.findByPk = jest.fn().mockResolvedValue(null);

      await listingController.update(req, res);

      expect(models.Listing.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Listing Not Found',
      });
    });

    test('should return 403 if user does not have access', async () => {
        req = {
            params: { listingId: 1 },
            body: {
              companyName: 'New Company',
              companyLogo: 'new-logo.png',
              name: 'New Listing',
              description: 'New Description',
              info: 'New Info',
              state: 'New State',
              gs: 'New GS',
              criteria: 'New Criteria',
              steps: [
                { id: 1, name: 'Step 1', step: 1, flowId: 1 },
                { id: 2, name: 'Step 2', step: 2, flowId: 2 },
                { id: -1, name: 'New Step', step: 3, flowId: 3 },
              ],
            },
            decoded: {
              user: { subsidiaryId: 1, authorities: ['asdf'] },
            },
          };

      models.Listing.findByPk = jest.fn().mockResolvedValue({
        id: 1,
        subsidiaryId: 2,
      });

      await listingController.update(req, res);

      expect(models.Listing.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Listing Not Found',
      });
    });

    test('should return 400 if an error occurs', async () => {
      const expectedError = new Error('Some error');

      models.Listing.findByPk = jest.fn().mockRejectedValue(expectedError);

      await listingController.update(req, res);

      expect(models.Listing.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(expectedError);
    });
  });
});
