const express = require('express');
const logger = require('../logger');
const { DatabaseError } = require('../models/DatabaseError');
const { InvalidInputError } = require('../models/InvalidInputError');
const router = express.Router();
const routeRoot = '/';
const model = require('../models/workoutMongoDb.js');


router.post('/orders',createOrder);
/**
 * function to create a single order using the body parameters of the request
 * @param {Request} request: expects an order id and a price in the body 
 * @param {Response} response: Sends a 400 response if the user input is incorrect, an error 500 if the database was not connected to and a level 200
 * @returns A level 200 response if the creation was successful 
 */
async function createOrder(request,response)
{
    try
    {
      const newEntry = await model.addOrder(request.body.orderId,request.body.price);
        if(newEntry == false)
        {
            logger.warn("Could not create the order: " + "order ID: " + request.body.orderId + " " + +"| Order Price: " + request.body.price);
            response.status(400);
            response.send("Failed to add order for unknown reason");

        }
        else
        {
            logger.info("Successfully added order");
            response.status(200);
            response.send(newEntry);
            
        }
    }
    catch(error)
    {
            logger.error("Failed to find an order: " + error.message );
            if(error instanceof DatabaseError)
            {
                logger.error(error.message);
            response.status(500);
            response.send({ errorMessage: "System error trying to add order" + error.message});
            }else if(error instanceof InvalidInputError){
                logger.error(error.message);
            response.status(400);
            response.send({errorMessage: "Validation error trying to add order: " + error.message});
            }else{
                logger.error(error.message);
            response.status(500);
            response.send({ errorMessage:"Unexpected error trying to add order: " + error.message});
        }

    }
}

router.get('/orders/:orderId',getSingleOrder);
/**
 * Controller function to get one order from the url parameters
 * @param {*} request: expects an order id in the url parameters format: GET https://localhost1333/orders/7
 * @param {*} response: Sends a 400 response if the user input is incorrect, an error 500 if the database was not connected to and a level 200 if successfully found
 * @returns A level 200 response if the order was foundand the order id of the found order
 */
async function getSingleOrder(request,response)
{
    try 
   {
        var orderId = request.params.orderId;
        const foundOrder = await model.getOneOrder(orderId);
        if( foundOrder )
        {
            logger.info("Successfully found order");
            response.status(200);
            response.send(foundOrder);
        }
        else
        {
            logger.warn("Could not find order specified");
            response.status(400);
            response.send("Could not find order");
        }
   }
   catch(error)
   {
        logger.error("Failed to find an order: " + error.message);
        if(error instanceof DatabaseError)
        {
            logger.error(error.message);
        response.status(500);
        response.send({ errorMessage: "System error trying to find order" + error.message});
        }else if(error instanceof InvalidInputError){
            logger.error(error.message);
        response.status(400);
        response.send({errorMessage: "Validation error trying to find order: " + error.message});
        }else{
            logger.error(error.message);
        response.status(500);
        response.send({ errorMessage:"Unexpected error trying to find order: " + error.message}); 
    }
    }
}


router.get("/orders",getAllOrders);
/**
 * controller function to get all orders
 * @param {*} request : expects nothing in this case, format: GET https://localhost1333/orders
 * @param {*} response : Sends an error 500 if the database was not connected to and a level 200 if successfully found
 * @returns A level 200 response and a list of all of the orders
 */
async function getAllOrders(request,response)
{
    try
    {
       const orderContents = await model.GetAllOrders();
       console.log(JSON.stringify(orderContents));
        if(orderContents)
        {

            printableOrderSheet = JSON.stringify(orderContents);
            logger.info("Listing all orders in a table below");
            console.table(orderContents);     
            response.status(200);
            response.send(orderContents);
        }
        else
        {
            logger.warn("Could not find orders table");
            response.status(500);
            response.send("Could not find orders table");
        }
    }
    catch(err)
    {
            logger.error();("Failed to find an order: " + err.message );
            if(err instanceof DatabaseError)
            {
                logger.error(err.message);
            response.status(500);
            response.send({ errorMessage: "System error trying to find orders" + err.message});
            }else if(err instanceof InvalidInputError){
                logger.error(err.message);
            response.status(400);
            response.send({errorMessage: "Validation error trying to find order: " + err.message});
            }else{
                logger.error(err.message);
            response.status(500);
            response.send({ errorMessage:"Unexpected error trying to find order: " + err.message});
        }
    }
}


router.put('/orders/:orderId',updateOrder);
/**
 * Controller function that updates the order specified in the url parameter
 * @param {URLSearchParams} request: expects an order id in the url parameters and an order id and price to serve as replacements in the body of the request, format: PUT https://localhost1333/orders/7
 * @param {*} response: Sends a 400 response if the user input is incorrect, an error 500 if the database was not connected to and a level 200 if successfully found
 * @returns A level 200 response and the new order id and the new price of that order id
 */
async function updateOrder(request,response)
{
       
  try 
  {
    replaced = await model.replaceOrder(request.params.orderId,request.body.orderId,request.body.price);
    if(replaced == false)
    {        
        logger.warn("Could not update order specified");
        response.status(400);
        response.send("Could not update order");
    }
    else
    {
        logger.info("Successfully updated order");
        response.status(200);
        response.send(replaced);
    }
  } 
  catch (err) 
  {
            logger.error();("Failed to find an order: " + err.message );
            if(err instanceof DatabaseError)
            {
                logger.error(err.message);
            response.status(500);
            response.send({ errorMessage: "System error trying to update order" + err.message});
            }else if(err instanceof InvalidInputError){
                logger.error(err.message);
            response.status(400);
            response.send({errorMessage: "Validation error trying to find order: " + err.message});
            }else{
                logger.error(err.message);
            response.status(500);
            response.send({ errorMessage:"Unexpected error trying to find order: " + err.message});
        }
    }
}


router.delete('/orders/:orderId',deleteOrder);
/**
 * controller function to delete order using the url parameter
 * @param {*} request: expects an order id in the url parameters format: DELETE https://localhost1333/orders/7
 * @param {*} response: Sends a 400 response if the user input is incorrect, an error 500 if the database was not connected to and a level 200 if successfully found
 * @returns A level 200 response and the order id of the order that was deleted
 */
async function deleteOrder(request,response)
{
    try
    {
      const orderToDelete = await model.deleteOrder(request.params.orderId);
        if(orderToDelete == false)
        {
            logger.warn("Could not delete order specified");
            response.status(400);
            response.send("Could not delete order");
        }
        else
        {
            logger.info("Successfully deleted order");
            response.status(200);
            response.send(orderToDelete);    
        }
    }
    catch(err)
    {
        logger.error();("Failed to find an order: " + err.message );
        if(err instanceof DatabaseError)
        {
            logger.error(err.message);
        response.status(500);
        response.send({ errorMessage: "System error trying to delete order" + err.message});
        }else if(err instanceof InvalidInputError){
            logger.error(err.message);
        response.status(400);
        response.send({errorMessage: "Validation error trying to find order: " + err.message});
        }else{
            logger.error(err.message);
        response.status(500);
        response.send({ errorMessage:"Unexpected error trying to find order: " + err.message});
        } 
    }
}



module.exports = {
    router,
    routeRoot,
    createOrder,
    getSingleOrder,
    getAllOrders,
    updateOrder,
    deleteOrder

}