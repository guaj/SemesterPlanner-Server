const Student = require('../models/student.model');
const FriendRequest = require('../models/friendRequest.model');
const StudyRoom = require('../models/studyRoom.model');
const StudentRepository = require('../repository/studentRepository')

module.exports = class FriendValidator {

    /**
     * Validator for request creation.
     * @param {*} data Request creation data. It should contain: senderEmail and receiverEmail.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateCreateData(data) {
        return new Promise(async (resolve, reject) => {
            let student1 = undefined, student2 = undefined;
            let res = { 'errors': [] };
            if (data.senderEmail == undefined || data.senderEmail == "") {
                res.errors.push('Missing sender email');
            }
            else {
                student1 = await Student.findOne({ email: data.senderEmail.toString() })
                if (!student1) {
                    res.errors.push('Sender does not exist');
                }
            }
            if (data.receiverEmail == undefined || data.receiverEmail == "") {
                res.errors.push('Missing receiver email');
            }
            else {
                student2 = await Student.findOne({ email: data.receiverEmail.toString() })
                if (!student2) {
                    res.errors.push('Receiver does not exist');
                }
            }
            if (student1 && student2) {
                if (await StudentRepository.isInFriendList(data.senderEmail, data.receiverEmail)) {
                    res.errors.push('Students are already friends')
                }
                if (await FriendRequest.findOne({ senderEmail: data.senderEmail.toString(), receiverEmail: data.receiverEmail.toString() })) {
                    res.errors.push('Friend request already exists')
                }
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

    /**
     * Validator for request accepting.
     * @param {string} requestID requestID of the request.
     * @param {string} email The email of the receiver.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateAcceptRequest(requestID, email) {
        return new Promise(async (resolve, reject) => {
            let student, request;
            let res = { 'errors': [] };
            if (email == undefined || email == "") {
                res.errors.push('Missing receiver email');
            }
            else {
                student = await Student.findOne({ email: email.toString() })
                if (!student) {
                    res.errors.push('Receiver does not exist');
                }
            }
            if (requestID == undefined || requestID == "") {
                res.errors.push('Missing request ID');
            }
            else {
                request = await FriendRequest.findOne({ _id: requestID.toString() })
                if (!request) {
                    res.errors.push('Request does not exist');
                }
            }
            if (student && request) {
                if (!(student.email == request.receiverEmail)) {
                    res.errors.push('Not the receiver of the request')
                }
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

    /**
     * Validator for request cancellation.
     * @param {string} requestID requestID of the request.
     * @param {string} email The email of the sender.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateCancelRequest(requestID, email) {
        return new Promise(async (resolve, reject) => {
            let student, request;
            let res = { 'errors': [] };
            if (email == undefined || email == "") {
                res.errors.push('Missing receiver email');
            }
            else {
                student = await Student.findOne({ email: email.toString() })
                if (!student) {
                    res.errors.push('Receiver does not exist');
                }
            }
            if (requestID == undefined || requestID == "") {
                res.errors.push('Missing request ID');
            }
            else {
                request = await FriendRequest.findOne({ _id: requestID.toString() })
                if (!request) {
                    res.errors.push('Request does not exist');
                }
            }
            if (student && request) {
                if (!(student.email == request.senderEmail)) {
                    res.errors.push('Not the sender of the request')
                }
            }
            if (res.errors[0]) {
                reject(res);
            }
            resolve();
        })
    }

    /**
     * Validator for request retrieval
     * @param {string} email The email of the student.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateRetrieveRequest(email) {
        return new Promise(async (resolve, reject) => {
            let student;
            let res = { 'errors': [] };
            if (email == undefined || email == "") {
                res.errors.push('Missing receiver email');
            }
            else {
                student = await Student.findOne({ email: email.toString() })
                if (!student) {
                    res.errors.push('Student does not exist');
                }
            }
            resolve();
        })
    }
}