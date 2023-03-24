const jwt = require('jsonwebtoken');

const verifyJWTAuth = (request, response, next) => {
  const headerToken = request.headers.cookie;
  if (headerToken == null) {
    // No token: 401
    response.status(401).json({ auth: false, message: 'No token found in request' });
  } else {
    jwt.verify(headerToken.split("=")[1], process.env.ACCESS_TOKEN_SECRET, {}, (err, decoded) => {
      if (err) {
        // Bad token: 403
        response.status(403).json({ auth: false, message: 'User authentication failed' });
      } else {
        request.userId = decoded.id;

        next();
      }
    });
  }
};

module.exports = { verifyJWTAuth };
