const jwt = require('jsonwebtoken');
const decodeTokenMiddleware = require('../decodeTokenMiddleware');

jest.mock('jsonwebtoken');

describe('decodeTokenMiddleware', () => {
  test('token valid test', () => {
    const req = { headers: { authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpZCI6MTUxNjIzOTAyMn0.ieQBx0rfrpPcJ3Bfm-0rA88vhIVe8NIYmsCW98ZWEQU' } };
    const res = {};
    const next = jest.fn();

    process.env.SECRET_KEY = 'challenge-gdesimone';

    const decoded = { id: 1, name: 'John Doe' };
    jwt.verify.mockImplementationOnce((token, secretKey, callback) => {
      callback(null, decoded);
    });

    decodeTokenMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.decoded).toBeDefined();
    expect(req.decoded.user.name).toBe('John Doe');
    expect(req.decoded.user.id).toBe(1);
  });

  test('token invalid test', () => {
    const req = { headers: { authorization: 'asdf' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    process.env.SECRET_KEY = 'challenge-gdesimone';

    const error = new Error('Token inválido');
    jwt.verify.mockImplementationOnce((token, secretKey, callback) => {
      callback(error, null);
    });

    decodeTokenMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'invalid token' });
  });
});