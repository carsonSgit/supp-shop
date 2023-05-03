
const { InvalidInputError } = require("./InvalidInputError");
const logger = require("../logger");

/**
 * validating function to check if the order id and price are correctly formatted or entered
 * @param {int32} orderId | id of the order you want to validate
 * @param {*} price | price of the order you want to validate
 * @returns true or false to create checks
 */
async function isValid2(orderId, price)
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



module.exports = { isValid2 };