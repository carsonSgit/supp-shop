import { Session } from "./session.types";

declare global {
	namespace Express {
		interface Request {
			authenticatedSession?: {
				sessionId: string;
				userSession: Session;
			};
		}
	}
}

export {};

