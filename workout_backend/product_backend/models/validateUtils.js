/**
 * Allows for this project to run functions in utilities.js
 */
 const validator = require('validator');
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
function isValid2(flavour, type, price){
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

module.exports = { isValid2 };