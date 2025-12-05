import { v4 as uuidv4 } from "uuid";
import { Session } from "../types/session.types";

//This object stores the user sessions
const sessions: Record<string, SessionClass> = {};

export function createSession(username: string, numMinutes: number): string {
	//Generate a random UUID as the sessionId
	const sessionId = uuidv4();

	//set the expiry time as numMinutes after the current time
	const expiresAt = new Date(Date.now() + numMinutes * 60000);

	//Create a session object containing information about the user and expiry time
	const thisSession = new SessionClass(username, expiresAt);

	//Add the session information to the sessions map, using sessionId as the key
	sessions[sessionId] = thisSession;

	return sessionId;
}

export function getSession(sessionId: string): SessionClass | undefined {
	return sessions[sessionId];
}

export function deleteSession(sessionId: string): void {
	delete sessions[sessionId];
}

//Each session contains the username of the user and the item at which it expires
//This object can be extended to store additional protected session information
export class SessionClass implements Session {
	username: string;
	ExpiresAt: Date;

	constructor(username: string, ExpiresAt: Date) {
		this.username = username;
		this.ExpiresAt = ExpiresAt;
	}

	isExpired(): boolean {
		return this.ExpiresAt < new Date();
	}
}

// Export Session type alias for backward compatibility
export { Session };

