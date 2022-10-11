const router = require('express').Router();
const User = require("../models/user.model");


/**
 * Login
 */
router.route('/').post((req, res) => {
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