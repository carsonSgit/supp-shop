import express, { Request, Response } from "express";
const router = express.Router();
import { authenticateUser, refreshSession } from "./sessionController";
const routeRoot = "/";

//Controller specified endpoints
router.get(routeRoot, showHome);
/**
 * Responds with a status code of 200 and a welcome message.
 *
 * @param request http request
 * @param response Sends a successful response
 */
function showHome(request: Request, response: Response): void {
	const authenticatedSession = authenticateUser(request);
	if (!authenticatedSession) {
		response.sendStatus(401); //Unauthorized Access
		return;
	}
	console.log(
		"User " +
			authenticatedSession.userSession.username +
			" is authorized for home page",
	);

	refreshSession(request, response);
	response.sendStatus(200);
}

export { router, routeRoot };

