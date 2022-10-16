const router = require('express').Router();
let User = require('../models/user.model');

/**
 * Get all users
 */
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user information
 */

//By id
router.route('/id/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

//By username
 router.route('/username/:username').get((req, res) => {
    User.findOne({username: req.params.username})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

//By email
 router.route('/email/:email').get((req, res) => {
    User.findOne({email: req.params.email})
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
//By id
router.route('/update/id/:id').post((req, res) => {
    User.findById(req.params.id)
        .then(user => {

            if (req.body.username) {
                user.username = req.body.username;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.program) {
                user.program = req.body.program;
            }

            user.save()
                .then(() => res.json(`User ${user.email} updated`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//By username
router.route('/update/username/:username').post((req, res) => {
    User.findOne({username: req.params.username})
        .then(user => {
            if (req.body.username) {
                user.username = req.body.username;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.program) {
                user.program = req.body.program;
            }

            user.save()
                .then(() => res.json(`User ${user.username} updated`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//By email
router.route('/update/email/:email').post((req, res) => {
    User.findOne({email: req.params.email})
        .then(user => {
            if (req.body.username) {
                user.username = req.body.username;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.program) {
                user.program = req.body.program;
            }
            console.log(req.body)
            user.save()
                .then(() => res.json(`User ${user.email} updated`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


/**
 * Add a user
 */
router.route('/add').post((req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const program = req.body.program;

    const newUser = new User({
        username,
        email,
        password,
        program,
    })

    newUser.save()
        .then(() => res.json(`User ${email} added`))
});

module.exports = router;