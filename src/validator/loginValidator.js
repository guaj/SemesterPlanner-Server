module.exports = class LoginValidator {

    /**
     * Validator for student creation.
     * @param {*} data Student creation data. It should contain: username, email, password, program (optional), faculty (optional) and privateProfile.
     * @returns {[string]} Returns a promise. Resolves with nothing, rejects with array of errors.
     */
    static async validateLogin(data) {
        let res = { 'errors': [] };
        if (data.email === undefined || data.email === "") {
            res.errors.push('Missing email');
        }
        if (data.password === undefined || data.password === "") {
            res.errors.push('Missing password');
        }
        if (res.errors[0]) {
            throw res;
        }
    }
}