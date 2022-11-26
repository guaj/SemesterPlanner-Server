const router = require('express').Router();
const TokenVerify = require('./tokenVerification').verifyJWTAuth;
const StudentRepository = require('../repository/studentRepository');
const StudyRoomRepository = require('../repository/studyRoomRepository');
const StudentValidator = require('../validator/studentValidator');

/**
 * Get all users
 */
router.route('/').get((req, res) => {
    StudentRepository.findAll()
        .then(users => res.json(users))
        .catch(err => res.status(400).json(err));
});

/**
 * Get user by ID
 */
router.route('/id/:id').get((req, res) => {
    StudentRepository.findOneByID(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
});

/**
 * Get user by username
 */
router.route('/username/:username').get((req, res) => {
    StudentRepository.findOneByUsername(req.params.username)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
});

/**
 * Get user by email
 */
router.route('/email/:email').get((req, res) => {
    StudentRepository.findOneByEmail(req.params.email)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
});

/**
 * Delete a user by ID
 */
router.route('/:id').delete((req, res) => {
    StudentRepository.deleteOne(req.params.id)
        .then(status => res.json(`${status} deleted`))
        .catch(err => res.status(400).json(err));
})

/**
 * Delete a user by email
 */
router.route('/email/:email').delete((req, res) => {
    StudentValidator.validateDelete(req.params.email).then(() => {
        StudyRoomRepository.findAllbyStudentEmail(req.params.email.toString()).then((rooms) => {
            // If the room has no participants left, delete the room.
            // If the student is the owner of the room, change owner to whoever is next, i.e. whoever is participants[0].
            if (rooms.length > 0) {
                for (let i = 0; i < rooms.length; i++) {
                    let participants = rooms[i].participants
                    if (participants.length == 1) {
                        StudyRoomRepository.deleteOne(rooms[i].studyRoomID);
                    }
                    else {
                        participants.shift();
                        if (rooms[i].owner == req.params.email) {
                            rooms[i].owner = participants[0];
                            StudyRoomRepository.updateOne(rooms[i]);
                        }
                        StudyRoomRepository.updateParticipants(rooms[i].studyRoomID, participants)
                    }
                }
            }
            StudentRepository.deleteOne(req.params)
                .then(status => res.json(`${status} deleted`))
                .catch(err => res.status(400).json(err));
        })
    })
        .catch(err => res.status(400).json(err));
});

/**
 * Update a user
 */
router.route('/update').post(TokenVerify, async (req, res) => {
    StudentRepository.findOneByEmail(req.body.email)
        .then(async (student) => {
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
                .catch(err => { res.status(400).json(err) });
        })
        .catch(err => res.status(400).json(err));
});

/**
 * Add a user
 */
router.route('/add').post(async (req, res) => {
    StudentRepository.create(req.body)
        .then((newStudent) => res.json(`Student ${newStudent.email} added`).status(200))
        .catch(err => {
            res.status(400).json(err)
        });

});

module.exports = router;
