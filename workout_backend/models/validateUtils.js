const validator = require('validator');


/**
 * Checks to see whether the username is empty (it can contain numbers and special characters).
 * @param {string} username 
 * @returns true if name isnt empty, false otherwise
 */
async function isValidUsername(username){
    return !validator.isEmpty(username);
}

/**
 * Checks to see whether the email is a valid email address
 * @param {string} email 
 * @returns true if email is valid, false otherwise
 */
async function isValidEmail(email){
    return validator.isEmail(email);
}

/**
 * Checks to see whether the password is valid and strong
 * @param {string} password 
 * @returns true if password is valid, false otherwise
 */
async function isValidPassword(password) {
    return validator.isStrongPassword(password);
}

module.exports = {isValidEmail,isValidPassword,isValidUsername};