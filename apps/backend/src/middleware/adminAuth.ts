import { Request, Response, NextFunction } from "express";
import { authenticateUser } from "../controllers/sessionController";
import { getSingleUser } from "../models/workoutMongoDb";
import logger from "../logger";

/**
 * Middleware to check if the authenticated user is an admin
 * Must be used after session authentication
 * 
 * @param request Express request object
 * @param response Express response object
 * @param next Express next function
 */
export async function requireAdmin(
	request: Request,
	response: Response,
	next: NextFunction,
): Promise<void> {
	try {
		// First check if user is authenticated
		const authenticatedSession = authenticateUser(request);
		if (!authenticatedSession) {
			response.status(401).json({
				error: "Unauthorized",
				message: "Authentication required",
			});
			return;
		}

		// Get user from database to check role
		const username = authenticatedSession.userSession.username;
		const user = await getSingleUser(username);

		if (!user) {
			logger.error(`User not found in database: ${username}`);
			response.status(401).json({
				error: "Unauthorized",
				message: "User not found",
			});
			return;
		}

		// Check if user has admin role
		// Default to "user" if role is not set (for backward compatibility)
		const userRole = user.role || "user";
		if (userRole !== "admin") {
			logger.warn(`Non-admin user attempted admin access: ${username}`);
			response.status(403).json({
				error: "Forbidden",
				message: "Admin access required",
			});
			return;
		}

		// User is authenticated and is an admin, proceed
		next();
	} catch (error) {
		const err = error as Error;
		logger.error(`Error in adminAuth middleware: ${err.message}`);
		response.status(500).json({
			error: "Internal Server Error",
			message: "Error verifying admin access",
		});
	}
}

