const router = require('express').Router();
const TokenVerify = require('./tokenVerification').verifyJWTAuth;
const StudentRepository = require('../repository/studentRepository');

/**
 * Get all users
 */
router.route('/').get((req, res) => {
    StudentRepository.findAll()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by ID
 */
router.route('/id/:id').get((req, res) => {
    StudentRepository.findOne(req.params)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by username
 */
router.route('/username/:username').get((req, res) => {
    StudentRepository.findOne(req.params)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Get user by email
 */
router.route('/email/:email').get((req, res) => {
    StudentRepository.findOne(req.params)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Delete a user by ID
 */
router.route('/:id').delete((req, res) => {
    StudentRepository.deleteOne(req.params.id)
        .then(status => res.json(`${status} deleted`))
        .catch(err => res.status(400).json('Error: ' + err));
})

/**
 * Delete a user by email
 */
router.route('/email/:email').delete((req, res) => {
    StudentRepository.deleteOne(req.params)
        .then(status => res.json(`${status} deleted`))
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Update a user
 */
router.route('/update').post(TokenVerify, async (req, res) => {
    StudentRepository.findOne(req.body)
        .then(async (student) => {
            if (req.body.username) {
                student.username = req.body.username;
            }
            if (req.body.email) {
                student.email = req.body.email;
            }
            if (req.body.password) {
                student.password = await bcrypt.hash(req.body.password, 10);
            }
            if (req.body.program) {
                student.program = req.body.program;
            }
            if (req.body.faculty) {
                student.faculty = req.body.faculty;
            }
            if (req.body.privateProfile) {
                student.privateProfile = req.body.privateProfile;
            }
            StudentRepository.updateOne(student)
                .then((student) => res.json(`Student ${student.email} updated`))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * Add a user
 */
router.route('/add').post(async (req, res) => {
    StudentRepository.create(req.body)
        .then((newStudent) => res.json(`Student ${newStudent.email} added`).status(200))
        .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;
