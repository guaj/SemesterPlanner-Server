const FriendRequest = require('../models/friendRequest.model');

module.exports = class FriendRequestRepository {

    /**
     * Delete a friend request.
     * @param {string} requestID : id of the request to delete
     * @returns {Promise<unknown>} Promise will resolve with the request deleted.
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
     * @returns {Promise<FriendRequest>}
     */
    static findBySenderEmail(email) {
        return new Promise((resolve, reject) => {
            FriendRequest.find({ senderEmail: email })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => reject(error))
        });
    };

    static findById(requestID) {
        return new Promise((resolve, reject) => {
            FriendRequest.findOne({ _id: requestID })
                .then(result => { resolve(result) })
                .catch(error => { reject(error) })
        })
    }

    /**
     * Find a request by receiver email
     * @param {string} email :
     * @returns {Promise<FriendRequest>}
     */
    static findByReceiverEmail(email) {
        return new Promise(
            (resolve, reject) => {
                FriendRequest.find({ receiverEmail: email })
                    .then(result => {
                        resolve(result);
                    })
                    .catch(error => {
                        reject(error)
                    })
            });
    };

    /**
     * Find a request by senderEmail and receiverEmail
     * @param {string} senderEmail
     * @param {string} receiverEmail
     * @returns {Promise<FriendRequest>}
     */
    static async findByEmails(senderEmail, receiverEmail) {
        return await new Promise((resolve, reject) => {
            FriendRequest.findOne({ senderEmail, receiverEmail })
                .then(result => { resolve(result) })
                .catch(error => { reject(error) })
        })
    }

    /**
     * Delete a friend request
     * @param requestID : request id to delete
     * @returns {Promise<unknown>} Promise will resolve with the status of the mongoDB transaction.
     */
    static async delete(requestID) {
        return await new Promise((resolve, reject) => {
            FriendRequest.deleteOne({ _id: requestID })
                .then((result) => resolve(result))
                .catch((error) => reject(error))

        });
    };

    /**
     * Save a new friend request
     * @param {FriendRequest} data : friend request object to be saved
     * @returns {Promise<unknown>}
     */
    static save(data) {
        return new Promise((resolve, reject) => {
            data.save()
                .then((result) => {
                    resolve(result)
                })
                .catch((error) => reject(error))
        });
    };
}