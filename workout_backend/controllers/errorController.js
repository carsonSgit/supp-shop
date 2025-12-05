const express = require("express");
const router = express.Router();
const routeRoot = "*";

//Controller specified endpoints
router.all(routeRoot, showError);
/**
 * Responds with a status code of 404 and an error message stating the page doesn't exist.
 *
 * @param {*} request http request
 * @param {*} response Sends a 404-level response
 */
function showError(request, response) {
	response.status(404);
	response.send("Invalid URL entered. Please try again.");
}

module.exports = {
	router,
	routeRoot,
};
