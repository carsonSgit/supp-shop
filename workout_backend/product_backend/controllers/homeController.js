const express = require('express');
const router = express.Router();
const routeRoot = '/';

router.get(routeRoot, showHome);

/**
 * Function to display a home page
 * @param {object} request 
 * @param {object} response 
 */
function showHome(request, response){
    response.status(200);
    response.send("Homepage currently under construction");
}

module.exports = {
    router,
    routeRoot
}