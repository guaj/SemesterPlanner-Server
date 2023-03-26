const router = require('express').Router();
const bcrypt = require('bcrypt');
const studentRepository = require('../repository/studentRepository')
const LoginValidator = require('../validator/loginValidator')
const {generateToken} = require("../repository/tokenRepository");

/**
 * Login
 */
router.post('/', async (request, response) => {
  const { body } = request;
  LoginValidator.validateLogin(request.body).then(() => {
    // Query MongoDb with email and get matching Student (will be null if none)
    studentRepository.findOneByEmail(body.email).then((user) => {
      // Bad Email: 401
      if (user == null) {
        response.status(401).json({ auth: false, message: 'Error: Incorrect Email or Password' });
        return;
      }

      const isCorrectPassword = bcrypt.compareSync(body.password, user.password);
      // Bad Password: 401
      if (!isCorrectPassword) {
        response.status(401).json({ auth: false, message: 'Error: Incorrect Email or Password' });
        return;
      }

      generateToken(response, user.id)

      const responsePayload = {
        auth: true,
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

router.route('/logout').get((req, res) => {
  res.clearCookie("jwt").status(200).json("Successfully logged out.");
})

module.exports = router;