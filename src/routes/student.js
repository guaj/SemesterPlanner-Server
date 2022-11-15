const router = require('express').Router();
const Student = require('../models/student.model');
const { createStudent, editStudent } = require("../factory/studentFactory");
const TokenVerify = require('./tokenVerification').verifyJWTAuth;

/**
 * Get all users
 */
router.route('/').get((req, res) => {
    Student.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by ID
 */
router.route('/id/:id').get((req, res) => {
    Student.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/email/:email').get((req, res) => {
    Student.findOne({ email: req.params.email })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by username
 */
router.route('/username/:username').get((req, res) => {
    Student.findOne({ username: req.params.username })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by email
 */
router.route('/email/:email').get((req, res) => {
    Student.findOne({ email: req.params.email })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Delete a user by ID
 */
router.route('/:id').delete((req, res) => {
    Student.findByIdAndDelete(req.params.id)
        .then(user => res.json(`Student deleted`))
        .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * Delete a user by email
 */
router.route('/email/:email').delete((req, res) => {
    Student.deleteOne({ email: req.params.email })
        .catch(err => res.status(400).json('Error: ' + err));
    res.json("deleted Student").status(200)
});

/**
 * Update a user
 */
router.route('/update').post(TokenVerify, async (req, res) => {
    Student.findOne({ email: req.body.email.toString() })
        .then(() => {
            editStudent(req.body).then((user) => {
                user.save()
                    .then(() => res.json(`Student ${user.email} updated`))
                    .catch(err => res.status(400).json('Error: ' + err));
            })
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Add a user
 */
router.route('/add').post(async (req, res) => {
    createStudent(req.body).then((newStudent) => {
        newStudent.save()
            .then(() => res.json(`Student ${newStudent.email} added`).status(200))
    })

});

module.exports = router;
