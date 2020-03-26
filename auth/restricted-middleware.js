const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if(authorization) {

      jwt.verify(authorization, jwtSecret, function(err, decodedToken) {
        if(err) {
          res.status(401).json({ message: "You are not authorized to perform this operation"});
        } else {
          req.token = decodedToken;
          next();
        }
      })
    } else {
      res.status(400).json({ message: "Please login to have access to this operation" });
    }
  };