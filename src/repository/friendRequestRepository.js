const FriendRequest = require('../models/friendRequest.model');

module.exports = class FriendRequestRepository {

    /**
     * Find a request by sender email
     * @param {string} email : sender email
     * @returns {Promise<FriendRequest>}
     */
    static findBySenderEmail(email) {
        return new Promise((resolve, reject) => {
            FriendRequest.find({senderEmail: email})
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => reject(error))
        });
    };

    static findById(requestId) {
        return new Promise((resolve, reject) => {
            FriendRequest.findOne({_id: requestId})
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
                FriendRequest.find({receiverEmail: email})
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
                FriendRequest.findOne({senderEmail, receiverEmail})
                    .then(result => { resolve(result) })
                    .catch(error => { reject(error) })
        })
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