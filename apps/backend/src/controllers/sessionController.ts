import express, { Request, Response } from "express";
import {
	createSession,
	getSession,
	deleteSession,
} from "./Session";
import { checkCredentials } from "./userController";
import { AuthenticatedSession } from "../types/session.types";
const router = express.Router();
const routeRoot = "/session";

router.post("/login", loginUser);
/** Log a user in and create a session cookie that will expire in 2 minutes */
async function loginUser(request: Request, response: Response): Promise<void> {
	const username = request.body.username;
	const password = request.body.password;

	if (username && password) {
		const isValid = await checkCredentials(username, password);
		if (isValid) {
			//Create a session object that will expire in 2 minutes
			const sessionId = createSession(username, 2);

			//Save cookie that will expire.
			const session = getSession(sessionId);
			if (session) {
				response.cookie("sessionId", sessionId, {
					expires: session.ExpiresAt,
					httpOnly: true,
				});
			}
		} else {
			console.log(
				"Unsuccessful login: Invalid username,password given for user: " +
					username,
			);
		}
	} else {
		console.log("Unsuccessful login: Empty username or password given");
	}
	response.sendStatus(200); //Redirect to main page whether session was set or not
}

router.get("/logout", logoutUser);
async function logoutUser(request: Request, response: Response): Promise<void> {
	const authenticatedSession = authenticateUser(request);
	if (!authenticatedSession) {
		response.sendStatus(401); //Unauthorized access
		return;
	}

	deleteSession(authenticatedSession.sessionId);
	console.log("Logged out user " + authenticatedSession.userSession.username);

	//"Erase" cookie by forcing it to expire.
	response.cookie("sessionId", "", { expires: new Date(), httpOnly: true });
	response.redirect("/");
}

export function authenticateUser(
	request: Request,
): AuthenticatedSession | null {
	//If this request doesn't have any cookies, that means it isn't authenticated. Return null.
	if (!request.cookies) {
		return null;
	}

	//We can obtain the session token from the requests cookies, which come with every request
	const sessionId = request.cookies["sessionId"];
	if (!sessionId) {
		//If the cookie is not set, return null
		return null;
	}
	//We then get the session of the user from our session map
	const userSession = getSession(sessionId);
	if (!userSession) {
		return null;
	}
	//If the session has expired, delete the session from our map and return null
	if (userSession.isExpired()) {
		deleteSession(sessionId);
		return null;
	}

	return { sessionId, userSession }; //Successfully validated
}

export function refreshSession(request: Request, response: Response): string | null {
	const authenticatedSession = authenticateUser(request);
	if (!authenticatedSession) {
		response.sendStatus(401); //Unauthorized Access
		return null;
	}

	//Create and store a new Session object that will expire in 2 minutes.
	const newSessionId = createSession(
		authenticatedSession.userSession.username,
		2,
	);

	//Delete the old entry in the session map
	deleteSession(authenticatedSession.sessionId);

	//Set the session cookie to the new id we generated, with a renewed expiration time
	const newSession = getSession(newSessionId);
	if (newSession) {
		response.cookie("sessionId", newSessionId, {
			expires: newSession.ExpiresAt,
			httpOnly: true,
		});
	}

	return newSessionId;
}

export { router, routeRoot, loginUser };

