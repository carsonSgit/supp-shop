const express = require('express');
const router = express.Router();
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
    response.status(200);
    response.send("Welcome to the home page of the workout website!");
}
module.exports = {
    router,
    routeRoot
}