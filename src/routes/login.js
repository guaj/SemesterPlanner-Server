const router = require('express').Router();
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Login
 */


router.post('/', async (request, response) => {
    const { body } = request;
  
    // Query MongoDb with email and get matching User (will be null if none)
    const user = await User.findOne({
      email: body.email,
    });
  
    // Bad Username: 401
    if (user == null) {
      return response.status(401).json({ auth: false, message: 'Error: Invalid Username or Password' });
    }
  
    const isCorrectPassword = await bcrypt.compareSync(body.password, user.password);
    // Bad Password: 401
    if (!isCorrectPassword) {
      return response.status(401).json({ auth: false, message: 'Error: Incorrect Username or Password' });
    }
  
    const tokenPayload = {
      id: user.id,
    };
    console.log(tokenPayload)
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
    console.log(responsePayload);
    console.log(tokenPayload)
    return response.status(200).json(responsePayload);
  });



router.route('/yyy').post((req, res) => {
    User.findOne({ 
        email: req.body.email,
    })
        .then(user => {
            if (user == null) {
                console.log('Email does not match')
            } else {
                if (user.password !== req.body.password) {
                    console.log('Password does not match')
                } else {
                    res.json(user)
                    console.log('Found user:' + user)
                }
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;