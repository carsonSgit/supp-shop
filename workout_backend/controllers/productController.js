const express = require('express');
const { MongoUnexpectedServerResponseError } = require('mongodb');
const { DatabaseError } = require('../product_backend/models/DatabaseError');
const { InvalidInputError } = require('../product_backend/models/InvalidInputError');
const router = express.Router();
const routeRoot = '/products';
const model = require('../models/workoutMongoDb');
const logger = require('../logger');

/**
 * Function that adds a product to the database through POST
 * using the 'BODY' parameters
 * @param {object} request 
 * @param {object} response 
 */

// If content type is post call createProduct
router.post('/', createProduct);

async function createProduct(request, response){
    // Assign values to those given in the POST request
    const flavour = request.body.flavour;
    const type = request.body.type;
    const price = request.body.price;
    try{
        // async add product to MongoDB database
        const added = await model.addProduct(flavour, type, price);

        if(added){
            logger.info("Successfully added a product");
            response.status(200);
            response.send(added);
        }
        else{
            logger.info("Unexpected failure to add product")
            response.status(400);
            response.send("Failed to add product for unexpected reason");
        }
    }
    catch(err){
        // If there was an input error caught in addProduct,
            // send to 400 page with error message
        if(err instanceof InvalidInputError){
            response.status(400);
            response.send(err.message);
        }
        // If there was an Database error caught in addProduct,
            // send to 500 page with error message
        else if(err instanceof DatabaseError){
            response.status(500);
            response.send(err.message);
        }
        // Unknown/unexpected error occurred...
        else{
            response.status(500);
            response.send("Unknown error: "+err.message);
        }
    }
}
/**
 * Function that uses the getAllProducts() function to retrieve an array 
 * of all products currently in the database.
 * @param {object} request 
 * @param {object} response 
 */
// If content type is get call followed by /all use getAllProduct
router.get('/all', getAllProduct);

async function getAllProduct(request, response){
    // Get the product from the database
    let foundProduct = await model.getAllProducts();

    // If returns a null value display that there was no successful match
    
    if(foundProduct== null){
        response.status(400);
        response.send("Product database was empty.");
    }
    // Otherwise, display the product found in the database
    else{
        /*let printString = "";
        for(let i=0; i<foundProduct.length; i++){
            printString += "<br>Flavour: " + foundProduct[i].flavour + " Type: "
            + foundProduct[i].type + " Price: $" + foundProduct[i].price;
        }*/
        response.status(200);
        response.send(foundProduct);
    }
}

/**
 * Function that uses the getSingleProduct() function with a URL parameter to retrieve
 * a product from the database.
 * @param {object} request 
 * @param {object} response 
 */
// If content type is get call getOneProduct
router.get('/:flavour', getOneProduct);

async function getOneProduct(request, response){
    // Assign the flavour-to-be-searched to the given request flavour
    const flavour = request.params.flavour;
    // If no flavour parameter is given, display error and do not continue
    if(flavour === undefined || flavour === null){
        response.status(400);
        response.send("Error: No product name inputted.");
    }
    // Otherwise...
    else{
        try{
            // Get the product from the database
            let foundProduct = await model.getSingleProduct(flavour);

            // If returns a null value display that there was no successful match
            
            if(foundProduct == null){
                response.status(400);
                response.send("Product " + flavour + " was not found.");
            }
            // Otherwise, display the product found in the database
            else{
                response.status(200);
                response.send(foundProduct);
            }
        }   
        catch(err){
            if(err instanceof InvalidInputError){
                response.status(400);
                logger.info(err.message);
                response.send("Error: Invalid input, please try with a flavour");
            }
            else if(err instanceof MongoUnexpectedServerResponseError){
                response.status(500);
                logger.info(err.message);
                response.send("Error: Unexpected server response error");
            }
            else{
                logger.info("Unexpected error: " + err.message);
            }
        }
    }
}

/**
 * Function that uses the updateOneProduct() function with JSON body parameters
 * to update a specified product from the database.
 * @param {*} request 
 * @param {*} response 
 */
// If content type is get put getOneProduct
router.put('/', updateProduct);
async function updateProduct(request, response){
    const flavour = request.body.flavour;
    const type = request.body.type;
    const price = request.body.price;
    const updatePrice = request.body.updatePrice;

    const oldProduct = {flavour: flavour, type: type, price: price};
    try{
        let updated = model.updateOneProduct(oldProduct, {price: updatePrice});
        if(updated){
            logger.info("Successfully updated a product");
            response.status(200);
            response.send(updated);
        }
        else{
            logger.info("Invalid price inputted to updateOneProduct()")
            response.status(400);
            response.send("Failed to update product for invalid input reason");
        }
    }
    catch(err){
        if(err instanceof DatabaseError){
            logger.info(err.message);
            response.status(500);
            response.send(err.message);
        }
        else{
            logger.info(err.message);
            response.status(500)
            response.send("Unexpected error occurred: " + err.message)
        }
    }
}

/**
 * Function that uses the deleteOneProduct() function with a JSON body parameter
 * to delete a specified product from the database.
 * @param {*} request 
 * @param {*} response 
 */
// If content type is delete call getOneProduct
router.delete('/', deleteProduct);
async function deleteProduct(request, response){
    const flavour = request.body.flavour;
    try{
        let updated = model.deleteOneProduct(flavour);
        if(updated){
            logger.info("Successfully deleted a product");
            response.status(200);
            response.send(updated);
        }
        else{
            logger.info("Invalid flavour inputted to deleteOneProduct()")
            response.status(400);
            response.send("Failed to delete product for invalid input reason");
        }
    }
    catch(err){
        if(err instanceof DatabaseError){
            logger.info(err.message);
            response.status(500);
            response.send(err.message);
        }
        else{
            logger.info(err.message);
            response.status(500)
            response.send("Unexpected error occurred: " + err.message)
        }
    }
}

module.exports = {
    router,
    routeRoot
}