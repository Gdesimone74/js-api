const models = require('../../models');
const { Readable } = require('stream');

const { createBulkSteps } = require('../bulkStepController');

jest.mock('../../models');
jest.mock('stream');

let req, res;

models.Listing.findByPk.mockResolvedValue({
  subsidiaryId: 1
});

models.Step.bulkCreate.mockResolvedValue(true);

Readable.from.mockReturnValue({
  pipe: jest.fn().mockReturnThis(),
  on: jest.fn((event, callback) => {
    if (event === 'data') {
      callback({ name: 'Paso 1', step: '1', listingFlow: 'Flujo 1' });
      callback({ name: 'Paso 2', step: '2', listingFlow: 'Flujo 2' });
    } else if (event === 'end') {
      callback();
    }
  }),
  resume: jest.fn()
});

beforeEach(() => {
  req = {
    decoded: {
      user: {
        subsidiaryId: 1,
        authorities: ['ROLE_ADMIN']
      }
    },
    params: {
      listingId: 1
    },
    file: {
      buffer: Buffer.from('nombre,step,listingFlow\nPaso 1,1,Flujo 1\nPaso 2,2,Flujo 2')
    }
  };

  res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };
});

describe('createBulkSteps', () => {
  test('should return 200 and success message on successful CSV processing', async () => {
    await createBulkSteps(req, res);

    expect(models.Listing.findByPk).toHaveBeenCalledWith(1);
    expect(models.Step.bulkCreate).toHaveBeenCalledWith([
      {
        name: 'Paso 1',
        step: '1',
        listingFlow: 'Flujo 1',
        listingId: 1
      },
      {
        name: 'Paso 2',
        step: '2',
        listingFlow: 'Flujo 2',
        listingId: 1
      }
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: 'CSV process' });
  });
});