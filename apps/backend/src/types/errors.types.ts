export class DatabaseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DatabaseError";
		Object.setPrototypeOf(this, DatabaseError.prototype);
	}
}

export class InvalidInputError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidInputError";
		Object.setPrototypeOf(this, InvalidInputError.prototype);
	}
}

