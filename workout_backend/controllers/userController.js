const express = require('express');
const router = express.Router();
const routeRoot='/users';
const model = require("../models/workoutMongoDb");
const { InvalidInputError } = require('../models/InvalidInputError');
const { DatabaseError } = require('../models/DatabaseError');
const logger = require('../logger');
const bcrypt=require('bcrypt');
const saltRounds=10;



//#region ---------------------------- Controller Methods ----------------------------------------------------------------

//at top so it runs before any other controllers specifically getOneUser
//Controller specified endpoint
router.get("/all",listAllUsers);
/**
 * Sends a request to the model to get all the users in the database.
 * @param {*} request  request, no expected values in body or params
 * @param {*} response Sends a successful response or 
 *                      a 500-level response if there is a system error
 */
async function listAllUsers(request,response){
    logger.info(request);

    let error;
    let foundUsers;
    try{
        foundUsers = await model.getAllUsers();
    }catch(err){
        error=err;
    }

    if(error==null){
        logger.trace("Sending response status of 200 for /users/get request");
        response.status(200);
        response.send(foundUsers);
    }else{
        //error handling
        logger.trace("Sending response status of 500 for /users/get request");
        logger.error(error.message);

        if(error instanceof DatabaseError){
            response.status(500);
            response.send({errorMessage:error.message});

        }else
        {
            response.status(500);
            response.send({errorMessage:"Unexpected error while retrieving all users: "+error.message});
        }
    }
}

//Controller specified endpoint
router.get("/:username",getOneUser);
/**
 * Gets the user username passed in the query from the database if it exists and sends an http response with a status code.
 * @param {*} request  request expecting parameters with values username 
 * @param {*} response Sends a successful response, 400-level response if inputs are invalid or 
 *                      a 500-level response if there is a system error
 */
async function getOneUser(request,response){
    logger.info(request);
    //get the username from the request parameter
    const username= request.params.username;
    let error;

    //Check that there was a passed parameter username
    if(username == undefined){
        logger.trace("Sending response status of 400 for an empty username");
        response.status(400);
        response.send({errorMessage:"Error: username is required"});
    }else{
        
        //Make call to model to get the user
        let foundUser;
        try{ 
            foundUser = await model.getSingleUser(username);
        }
        catch(err){
            error = err;
        }
        
        if(error!=null){
            //error handling
            logger.error(error.message);
            if(error instanceof InvalidInputError){
                logger.trace("Sending response status of 400 for GET /users/"+username+ " request");
                response.status(400);
                response.send({errorMessage:error.message});
            }else if(error instanceof DatabaseError){
                logger.trace("Sending response status of 500 for GET /users/"+username+ " request");
                response.status(500);
                response.send({errorMessage:error.message});
            }else{
                logger.trace("Sending response status of 500 for GET /users/"+username+ " request");
                response.status(500);
                response.send({errorMessage:"Unexpected error while retrieving user: "+error.message});
            }
        }
        else{
            //check if the user was found
            if(foundUser==null){
                logger.trace("Sending response status of 400 for GET /users/"+username+ " request, user not found");
                response.status(400);
                response.send({errorMessage:"User: " + username + " not found"});
            }else{
                responseMessage ="User: " + foundUser.username + " found with email: " + foundUser.email;
                logger.trace("Sending response status of 200 for GET /users/"+username+ " request");
                logger.info(responseMessage);
                response.status(200);
                response.send({username:foundUser.username,email:foundUser.email});
            }
        }
    }
}

//Controller specified endpoint
router.post("/", createUser);
/**
 * Passes the  username, email and password from the request body to the model to add it to the database.
 * Responds with a status code indicating if it was successfully or not and a message.
 * 
 * @param {*} request Express request expecting JSON body with values request.body.username, request.body.email and request.body.password
 * @param {*} response Sends a successful response, 400-level response if inputs are invalid or 
 *                      a 500-level response if there is a system error
 */
async function createUser(request,response){
    logger.info(request);
   //get needed values from request body
    const username = request.body.username;
    const email = request.body.email;

    //get password from request body, that must be secure!
    const password = request.body.password;

    let error;

    //make call to model
    try{
     await model.addUser(username,email,password);
    }catch(err){
        error =err;
    }

    if(error==null){
        let responseMessage = "Successfully added user: "+username+" email: "+email;
        logger.trace("Sending response status of 200 for POST /users ");
        logger.info(responseMessage);
        response.status(200);
        response.send({username:username, email:email});
    }else{
        //error handling
        logger.error(error.message);

        if(error instanceof InvalidInputError){
            logger.trace("Sending response status of 400 for POST /users ");
            response.status(400);
            response.send({errorMessage:error.message});
        }else if(error instanceof DatabaseError){
            logger.trace("Sending response status of 500 for POST /users ");
            response.status(500);
            response.send({errorMessage:error.message});

        }else
        {
            logger.trace("Sending response status of 500 for POST /users ");
            response.status(500);
            response.send({errorMessage:"Unexpected error while adding user: "+username +" email: "+email +" "+error.message});
        }
    }

}

//Controller specified endpoint
router.delete("/:username", deleteUser);
/**
 * Passes the username request body to the model to delete it from the database.
 * Responds with a status code indicating if it was successfully or not and a message.
 * 
 * @param {*} request Express request expecting JSON body with values request.body.username
 * @param {*} response Sends a successful response, 400-level response if inputs are invalid or 
 *                      a 500-level response if there is a system error
 */
async function deleteUser(request,response){
    logger.info(request);
    //get needed values from request body
    const username = request.params.username;

    let error;

    try{
        await model.deleteSingleUser(username);
    }catch(err){
        error=err;
    }

    if(error==null){
        let responseMessage = "Successfully deleted user: "+username;
        logger.trace("Sending response status of 200 for DELETE /users/"+username);
        logger.info(responseMessage);
        response.status(200);
        response.send({username:username});
    }else{
        //error handling
        logger.error(error.message);

        if(error instanceof InvalidInputError){
            logger.trace("Sending response status of 400 for DELETE /users/"+username);
            response.status(400);
            response.send({errorMessage:error.message});
        }else if(error instanceof DatabaseError){
            logger.trace("Sending response status of 500 for DELETE /users/"+username);
            response.status(500);
            response.send({errorMessage:error.message});

        }else
        {
            logger.trace("Sending response status of 500 for DELETE /users/"+username);
            response.status(500);
            response.send({errorMessage:"Unexpected error while deleting user: "+username +" "+error.message});
        }
    }
}

//Controller specified endpoint
router.put("/:username", updateUser);
/**
 * Passes the old/new username, email and password from request to the model to update the old username with the new 
 * values in the database.
 * Responds with a status code indicating if it was successfully or not and a message.
 * 
 * @param {*} request Express request expecting JSON body with values request.body.username, request.body.email and request.body.password 
 *                   and a parameter with value request.params.username
 * @param {*} response Sends a successful response, 400-level response if inputs are invalid or 
 *                      a 500-level response if there is a system error
 */
async function updateUser(request,response){
    logger.info(request);
    //get required values from request body and params
    const oldUsername = request.params.username;
    const newUsername = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    let error;
    try{
        await model.updateSingleUser(oldUsername,newUsername,email,password);
    }catch(err)
    {
        error=err;
    }
    if(error==null){
        let responseMessage = "Successfully updated user: "+oldUsername +" to "+newUsername +" with email: "+email;
        logger.trace("Sending response status of 200 for PUT /users/"+oldUsername);
        logger.info(responseMessage);
        response.status(200);
        response.send({username:newUsername, email:email});
    }else{
        //error handling
        logger.error(error.message);

        if(error instanceof InvalidInputError){
            logger.trace("Sending response status of 400 for PUT /users/"+oldUsername);
            response.status(400);
            response.send({errorMessage:error.message});
        }else if(error instanceof DatabaseError){
            logger.trace("Sending response status of 500 for PUT /users/"+oldUsername);
            response.status(500);
            response.send({errorMessage:error.message});

        }else
        {
            logger.trace("Sending response status of 500 for PUT /users/"+oldUsername);
            response.status(500);
            response.send({errorMessage:"Unexpected error while updating user: "+oldUsername +" "+error.message});
        }
    }

}

//#endregion

/** Returns true if there is a stored user with the same username and password */
async function checkCredentials(username,password){
    let user;
    try{
        user = await model.getSingleUser(username);
    }catch(err){
        logger.error(err.message);
        return false;
    }

    const isSame = await bcrypt.compare(password,user.password);
    return isSame;
}

module.exports = {
    router,
    routeRoot,
    checkCredentials
}