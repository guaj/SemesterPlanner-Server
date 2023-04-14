const jwt = require('jsonwebtoken');

const verifyJWTAuth = (request, response, next) => {
  const headerToken = request.headers.cookie;

  if (headerToken == null) {
    // No token: 403
    response.status(403).json({ auth: false, message: 'No token found in request' });
  } else {
    headers = headerToken.split(';');
    jwt_token = headers.filter(element => element.includes("jwt"))

    jwt.verify(jwt_token[0].split("=")[1], process.env.ACCESS_TOKEN_SECRET, {}, (err, decoded) => {
      if (err) {
          // Bad token: 403
          response.status(401).json({ auth: false, message: 'User authentication failed'});
      } else {
        request.userId = decoded.id;

        next();
      }
    });
  }
};

const generateToken = (response, userId) => {
  const tokenPayload = {
    id: userId,
  };

  // generating the JWT token
  const tokenJWT = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' }, {});

  response.cookie('jwt', tokenJWT, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  })
}

module.exports = { verifyJWTAuth, generateToken };
