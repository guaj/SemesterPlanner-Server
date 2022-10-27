const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');

const TokenVerify = require('./tokenVerification').verifyJWTAuth;
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
router.route('/id/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/email/:email').get((req, res) => {
    User.findOne({email: req.params.email})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by username
 */
 router.route('/username/:username').get((req, res) => {
    User.findOne({username: req.params.username})
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by email
 */
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
router.route('/update').post( TokenVerify, async (req, res) => {
    if(req.body.password){
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                         }

    User.findOne({email: req.body.email})
        .then(user => {
            if (req.body.username) {
                user.username = req.body.username;
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.password) {
                user.password = hashedPassword;
            }
            if (req.body.program) {
                user.program = req.body.program;
            }
            if (req.body.faculty) {
                user.faculty = req.body.faculty;
            }
            if (req.body.privateProfile) {
                user.privateProfile= req.body.privateProfile;
            }
            

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
    const program = req.body.program;
    const faculty = req.body.faculty;
    const privateProfile= req.body.privateProfile;

    const newUser = new User({
        username,
        email,
        password,
        program,
        faculty,
        privateProfile
    })

    newUser.save()
        .then(() => res.json(`User ${email} added`))
});

module.exports = router;