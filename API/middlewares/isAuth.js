const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.token;
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    console.log(error);
  }
  const token = req.token;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
