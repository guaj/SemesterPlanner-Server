const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

/**
 * Get all users
 */
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by ID
 */
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Delete a user by ID
 */
router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json(`User deleted`))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Update a user
 */
router.route('/update').post( async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    User.findOne({"email":req.body.email})
        .then(user => {
            user.username = req.body.username;
            user.email = req.body.email;
            user.password = hashedPassword;
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.program = req.body.program;

            user.save()
                .then(() => res.json(`User ${user.email} updated`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Add a user
 */
router.route('/add').post( async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;
    const email = req.body.email;
    const password = hashedPassword;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const program = req.body.program;

    const newUser = new User({
        username,
        email,
        password,
        firstName,
        lastName,
        program,
    })

    newUser.save()
        .then(() => res.json(`User ${email} added`))
});

module.exports = router;