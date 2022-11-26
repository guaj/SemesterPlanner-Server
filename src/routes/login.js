const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const studentRepository = require('../repository/studentRepository')
const LoginValidator = require('../validator/loginValidator')

/**
 * Login
 */
router.post('/', async (request, response) => {
  const { body } = request;
  LoginValidator.validateLogin(request.body).then(() => {
    // Query MongoDb with email and get matching Student (will be null if none)
    studentRepository.findOneByEmail(body.email).then((user) => {
      // Bad Username: 401
      if (user == null) {
        response.status(401).json({ auth: false, message: 'Error: Invalid Username or Password' });
        return;
      }

      const isCorrectPassword = bcrypt.compareSync(body.password, user.password);
      // Bad Password: 401
      if (!isCorrectPassword) {
        response.status(401).json({ auth: false, message: 'Error: Incorrect Username or Password' });
        return;
      }

      const tokenPayload = {
        id: user.id,
      };
      // generating the JWT token
      const tokenJWT = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' }, {});
      const responsePayload = {
        auth: true,
        token: tokenJWT,
        profile: {
          username: user.username,
          email: user.email,

        },
      };

      // OK 200
      response.status(200).json(responsePayload);
    })
      .catch(err => response.status(400).json('Error: ' + err));
  })
    .catch(err => response.status(400).json(err));
});

router.route('/yyy').post((req, res) => {
  studentRepository.findOneByEmail(req.body.email)
    .then(user => {
      if (user == null) {
        console.log('Email does not match')
      } else {
        if (user.password !== req.body.password) {
          console.log('Password does not match')
        } else {
          res.json(user)
        }
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;