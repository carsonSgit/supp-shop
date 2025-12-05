export interface Session {
	username: string;
	ExpiresAt: Date;
	sessionId?: string;
}

export interface AuthenticatedSession {
	sessionId: string;
	userSession: Session;
}

