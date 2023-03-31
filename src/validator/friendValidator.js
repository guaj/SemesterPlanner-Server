const Student = require('../models/student.model');
const FriendRequest = require('../models/friendRequest.model');
const StudentRepository = require('../repository/studentRepository')

module.exports = class FriendValidator {

    /**
     * Validator for request creation.
     * @param {*} data Request creation data. It should contain: senderEmail and receiverEmail.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateCreateData(data) {
        return new Promise((resolve, reject) => {
            let student1 = undefined, student2 = undefined;
            let res = { 'errors': [] };
            if (data.senderEmail === undefined || data.senderEmail === "") {
                res.errors.push('Missing sender email');
            }
            else {
                Student.findOne({ email: data.senderEmail.toString() }).then((res) => {
                    student1 = res;
                    if (!student1) {
                        res.errors.push('Sender does not exist');
                    }
                }).catch((err) => res.errors.push(err))
            }
            if (data.receiverEmail === undefined || data.receiverEmail === "") {
                res.errors.push('Missing receiver email');
            }
            else {
                Student.findOne({ email: data.receiverEmail.toString() }).then((res) => {
                    student2 = res;
                    if (!student2) {
                        res.errors.push('Receiver does not exist');
                    }
                }).catch((err) => res.errors.push(err))
            }
            if (student1 && student2) {
                StudentRepository.isInFriendList(data.senderEmail, data.receiverEmail).then((res1) => {
                    if (res1)
                        res.errors.push('Students are already friends')
                }).catch((err) => res.errors.push(err))

                FriendRequest.findOne({ senderEmail: data.senderEmail.toString(), receiverEmail: data.receiverEmail.toString() }).then((res2) => {
                    if (res2)
                        res.errors.push('Friend request already exists')
                }).catch((err) => res.errors.push(err))
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
     * @param {string} receiverEmail The email of the receiver.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateAcceptRequest(requestID, receiverEmail) {
        return new Promise((resolve, reject) => {
            let student, request;
            let res = { 'errors': [] };
            if (receiverEmail === undefined || receiverEmail === "") {
                res.errors.push('Missing receiver email');
            }
            else {
                Student.findOne({ email: receiverEmail.toString() }).then((res) => {
                    student = res;
                    if (!student) {
                        res.errors.push('Receiver does not exist');
                    }
                }).catch((err) => res.errors.push(err))
            }
            if (requestID === undefined || requestID === "") {
                res.errors.push('Missing request ID');
            }
            else {
                FriendRequest.findOne({ _id: requestID.toString() }).then((res) => {
                    request = res;
                    if (!request) {
                        res.errors.push('Request does not exist');
                    }
                }).catch((err) => res.errors.push(err))
            }
            if (student && request) {
                if (student.email !== request.receiverEmail) {
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
     * @param {string} senderEmail The email of the sender.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static validateCancelRequest(requestID, senderEmail) {
        return new Promise((resolve, reject) => {
            let student, request;
            let res = { 'errors': [] };
            if (senderEmail === undefined || senderEmail === "") {
                res.errors.push('Missing sender email');
            }
            else {
                Student.findOne({ email: senderEmail.toString() }).then((res) => {
                    student = res;
                    if (!student) {
                        res.errors.push('Sender does not exist');
                    }
                }).catch((err) => res.errors.push(err))
            }
            if (requestID === undefined || requestID === "") {
                res.errors.push('Missing request ID');
            }
            else {
                FriendRequest.findOne({ _id: requestID.toString() }).then((res) => {
                    request = res;
                    if (!request) {
                        res.errors.push('Request does not exist');
                    }
                }).catch((err) => res.errors.push(err))
            }
            if (student && request) {
                if (student.email !== request.senderEmail) {
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
        return new Promise((resolve, reject) => {
            let student;
            let res = { 'errors': [] };
            if (email === undefined || email === "") {
                res.errors.push('Missing receiver email');
            }
            else {
                Student.findOne({ email: email.toString() }).then((res) => {
                    student = res;
                    if (!student) {
                        res.errors.push('Student does not exist');
                    }
                }).catch((err) => res.errors.push(err))
            }
            if (res.errors[0])
                reject(res);
            resolve();
        })
    }
}