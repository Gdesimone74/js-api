const jwt = require('jsonwebtoken');

const decodeTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  const secretKey = process.env.SECRET_KEY;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: 'invalid token' });
    } else {
      const user = decoded;
      req.decoded = { user };
      req.decoded.authorization = user.authorities;
      next();
    }
  });
};

module.exports = decodeTokenMiddleware;
