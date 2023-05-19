const express = require('express');
const router = express.Router();
const {authenticateUser,refreshSession} = require("./sessionController");
const routeRoot='/';

//Controller specified endpoints
router.get(routeRoot,showHome);
/**
 * Responds with a status code of 200 and a welcome message.
 * 
 * @param {*} request http request 
 * @param {*} response Sends a successful response
 */
function showHome(request,response){
    const authenticatedSession = authenticateUser(request);
    if(!authenticatedSession){
        response.sendStatus(401); //Unauthorized Access
        return;
    }
    console.log("User "+authenticatedSession.userSession.username+" is authorized for home page");
    response.status(200);

    refreshSession(request,response);
    response.send("Welcome to the home page of the workout website!");
}
module.exports = {
    router,
    routeRoot
}