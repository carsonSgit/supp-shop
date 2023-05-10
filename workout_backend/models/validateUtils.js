const validator = require('validator');
const logger = require("../logger");
const { InvalidInputError } = require('./InvalidInputError');

/**
 * Checks to see that flavour is valid (not null && is alphabetic)
 * Verifies that price is not null
 * Verifies that type is "Pre-workout" or "Protein-powder" & that the price is greater than 0
 * @param {string} flavour 
 * @param {string} type 
 * @param {string} price 
 * @returns false if flavour is invalid
 * @returns false if price is null
 * @returns false if type is not "Pre-workout" or "Protein-powder"
 * @returns false if price is not greater than 0
 * @returns true if valid flavour, price, and type
 */
function isValidProduct(flavour, type, price){
    if(!flavour || !validator.isAlpha(flavour)){
        console.log('Invalid flavour input: Must be valid string');
        return false;
    }
    if(!price){
        console.log('Invalid price input: Must be greater than 0');
        return false;
    }
    if((type == "Pre-workout" || type == "Protein-powder") &&  parseFloat(price) >= 0){
        return true;
    }
    console.log('Invalid type input: Must be Pre-workout or Protein-powder');
    return false;
}


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
/**
 * validating function to check if the order id and price are correctly formatted or entered
 * @param {int32} orderId | id of the order you want to validate
 * @param {*} price | price of the order you want to validate
 * @returns true or false to create checks
 */
async function isValidOrder(orderId, price)
{
try {
    
    if(orderId > 0 && price > 0 && orderId != null && price != null)
    {
        return true;
    }
    else
    {
       
       return false
    }
} 
catch (error) 
{
    if(error instanceof InvalidInputError)
    {
        logger.error(error.message);
        throw error;
    }
}
   
}


//async function isDuplicate(orderId){
   
//}

module.exports = {isValidEmail,isValidPassword,isValidUsername,isValidProduct,isValidOrder};