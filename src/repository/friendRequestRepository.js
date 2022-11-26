const FriendRequest = require('../models/friendRequest.model');
const createFriendRequest = require("../factory/friendRequestFactory");
const createCourseNotes = require("../factory/courseNotesFactory");

module.exports = class FriendRequestRepository {

    /**
     * Delete a friend request.
     * @param {string} requestId : id of the request to delte
     * @returns {Promise<unknown>}
     */
    static async deleteFriendRequest(requestId) {
        return await new Promise((resolve, reject) => {
            FriendRequest.findOneAndDelete({_id: requestId})
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
            FriendRequest.findOne({senderEmail: email})
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
             (resolve, reject) => FriendRequest.find({receiverEmail: email}
                .then(result => resolve(result))
                .catch(error => reject(error))
            )
        )
    }

    /**
     * Delete a friend request
     * @param requestId : request id to delete
     * @returns {Promise<unknown>}
     */
    static async delete(requestId) {
        return await new Promise((resolve, reject) => {
            FriendRequest.deleteOne({_id: requestId})
                .then((result) => resolve(result))
                .catch((error) => reject(error))

        })
    }

    /**
     * Save a new friend request
     * @param {FriendRequest} data : friend request object to be saved
     * @returns {Promise<unknown>}
     */
    static save(data) {
        return new Promise((resolve, reject) => {
            data.save()
                .then((result) => resolve(result))
                .catch((error) => reject(error))
        })
    }
}