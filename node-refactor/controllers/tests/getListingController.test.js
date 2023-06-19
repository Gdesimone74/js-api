const { Listing } = require('../../models');
const controller = require('../getListingController');

describe('getListingController', () => {
  test('should return 200 and listing object on successful retrieval', async () => {
    const mockListing = { id: 1, title: 'Test Listing' };

    Listing.findByPk = jest.fn().mockResolvedValue(mockListing);

    const req = {
      params: { listingId: 1 },
    };

    const res = {
      json: jest.fn(),
    };

    await controller.get(req, res);

    expect(Listing.findByPk).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockListing);
  });

  test('should return 500 if an error occurs during retrieval', async () => {
    const mockError = new Error('Test Error');

    Listing.findByPk = jest.fn().mockRejectedValue(mockError);

    const req = {
      params: { listingId: 1 },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await controller.get(req, res);

    expect(Listing.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error en el servidor' });
  });
});