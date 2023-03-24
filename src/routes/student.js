const router = require('express').Router();
const TokenVerify = require('./tokenVerification').verifyJWTAuth;
const StudentRepository = require('../repository/studentRepository');
const StudyRoomRepository = require('../repository/studyRoomRepository');
const StudentValidator = require('../validator/studentValidator');
const FriendRequestRepository = require('../repository/friendRequestRepository');
const bcrypt = require("bcrypt");

/**
 * Get all users
 */
router.route('/').get(TokenVerify, (req, res) => {
    StudentRepository.findAll()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(400).json(err));
});

/**
 * Get user by ID
 */
router.route('/id/:id').get(TokenVerify, (req, res) => {
    StudentRepository.findOneByID(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
});

/**
 * Get user by username
 */
router.route('/username/:username').get(TokenVerify, (req, res) => {
    StudentRepository.findOneByUsername(req.params.username)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
});

/**
 * Get user by email
 */
router.route('/email/:email').get(TokenVerify, (req, res) => {
    StudentRepository.findOneByEmail(req.params.email)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
});

/**
 * Delete a user by ID
 */
router.route('/:id').delete(TokenVerify, (req, res) => {
    StudentRepository.deleteOne(req.params.id)
        .then(status => res.json(`${status} deleted`))
        .catch(err => res.status(400).json(err));
})

/**
 * Delete a user by email
 */
router.route('/email/:email').delete(TokenVerify, (req, res) => {
    StudentValidator.validateDelete(req.params.email).then(() => {
        StudyRoomRepository.findAllbyStudentEmail(req.params.email.toString()).then(async (rooms) => {
            // If the room has no participants left, delete the room.
            // If the student is the owner of the room, change owner to whoever is next, i.e. whoever is participants[0].
            if (rooms.length > 0) {
                for (let room of rooms) {
                    let participants = room.participants
                    if (participants.length === 1) {
                        await StudyRoomRepository.deleteOne(room.studyRoomID);
                    }
                    else {
                        participants.shift();
                        if (room.owner === req.params.email) {
                            room.owner = participants[0];
                            StudyRoomRepository.updateOne(room);
                        }
                        await StudyRoomRepository.updateParticipants(room.studyRoomID, participants)
                    }
                }
            }

            // Remove the student from other's friendlist
            StudentRepository.findOneByEmail(req.params.email.toString()).then(async (student) => {
                if (student.friends.length > 0) {
                    let friends = student.friends
                    for (let friendEmail of friends) {
                        let friend = await StudentRepository.findOneByEmail(friendEmail)
                        let friendFriendlist = friend.friends;
                        const friendIndex = friendFriendlist.indexOf(req.params.email);
                        friendFriendlist.splice(friendIndex, 1);
                        await StudentRepository.updateFriendList(friendEmail, friendFriendlist)
                    }
                }

                // Removing any incoming or outgoing requests
                FriendRequestRepository.findByReceiverEmail(req.params.email).then(async (requests) => {
                    for (let request of requests) {
                        await FriendRequestRepository.deleteFriendRequest(request._id);
                    }
                })
                FriendRequestRepository.findBySenderEmail(req.params.email).then(async (requests) => {
                    for (let request of requests) {
                        await FriendRequestRepository.deleteFriendRequest(request._id);
                    }
                })

                StudentRepository.deleteOne(req.params)
                    .then(status => res.json(`${status} deleted`))
                    .catch(err => res.status(400).json(err));
            })
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
router.route('/add').post((req, res) => {
    StudentRepository.create(req.body)
        .then((newStudent) => res.json(`Student ${newStudent.email} added`).status(200))
        .catch(err => {
            res.status(400).json(err)
        });

});

/**
 * Get student studyhours
 * @param {string} email Student email
 * @return {number} Total number of studyhours 
 */
router.route('/studyhours/:email').get(TokenVerify, (req, res) => {
    StudentRepository.findOneByEmail(req.params.email)
        .then((student) => {
            let courses = student.courses;
            let totalHours = 0;
            for (let course of courses) {
                totalHours += parseFloat(course.studyHours);
            }
            res.status(200).json({ 'studyHours': totalHours })
        })
        .catch(err => res.status(400).json(err));
});

/**
 * Get student courses
 * @param {string} email Student email
 * @return {[String]} Array of course subjects + catalogs
 */
router.route('/courses/:email').get(TokenVerify, (req, res) => {
    StudentRepository.findOneByEmail(req.params.email)
        .then((student) => {
            res.status(200).json({ 'courses': student.courses })
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;
