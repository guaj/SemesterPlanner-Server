const FriendRequest = require('../models/friendRequest.model');
const createFriendRequest = require("../factory/friendRequestFactory");
const createCourseNotes = require("../factory/courseNotesFactory");

module.exports = class FriendRequestRepository {

    /**
     * Delete a friend request.
     * @param {string} requestID : id of the request to delete
     * @returns {Promise<unknown>}
     */
    static async deleteFriendRequest(requestID) {
        return await new Promise((resolve, reject) => {
            FriendRequest.findOneAndDelete({ _id: requestID })
                .then((result) => resolve(result))
                .catch((error) => reject(error))
        })
    }

    /**
     * Find a friend request by requestID.
     * @param {string} _id : id of the request
     * @returns {Promise<unknown>}
     */
    static async findByID(_id) {
        return await new Promise((resolve, reject) => {
            FriendRequest.findOne({ _id: _id })
                .then((result) => resolve(result))
                .catch((error) => reject(error))
        })
    }

    /**
     * Find a request by sender email
     * @param {string} email : sender email
     * @returns {Promise<unknown>}
     */
    static async findBySenderEmail(email) {
        return await new Promise((resolve, reject) => {
            FriendRequest.find({ senderEmail: email })
                .then((result) => resolve(result))
                .catch((error) => reject(error))
        })
    }

    /**
     * Find a request by receiver email
     * @param {string} email :
     * @returns {Promise<unknown>}
     */
    static async findByReceiverEmail(email) {
        return await new Promise(
            (resolve, reject) => FriendRequest.find({ receiverEmail: email })
                .then(result => resolve(result))
                .catch(error => reject(error))
        )
    }

    /**
     * Save a new friend request
     * @param {FriendRequest} data : friend request object to be saved
     * @returns {Promise<unknown>}
     */
    static save(data) {
        return new Promise((resolve, reject) => {
            data.save((err, message) => {
                if (err) { reject(err); }
                resolve(message);
            })
        })
    }

    /**
     * Delete a friend request.
     * @param {string} requestID : id of the request to delete
     * @returns {Promise<unknown>}
     */
    static async delete(requestID) {
        return await new Promise((resolve, reject) => {
            FriendRequest.deleteOne({ _id: requestID })
                .then((result) => resolve(result))
                .catch((error) => reject(error))
        })
    }
}