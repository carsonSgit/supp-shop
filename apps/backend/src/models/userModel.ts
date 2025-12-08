import { Collection, MongoServerError } from "mongodb";
import { InvalidInputError } from "./InvalidInputError";
import { DatabaseError } from "./DatabaseError";
import * as validateUtils from "./validateUtils";
import logger from "../logger";
import bcrypt from "bcrypt";
import { User } from "../types/models.types";
import { getUserCollection } from "./database";

const saltRounds = 10;

/**
 * Adds a new user to the collection, if the passed parameters are valid and if a user with username and email don't already exist
 * @param username
 * @param email
 * @param password
 * @throws {InvalidInputError} when username,email or password are invalid or if username/email is in use already
 * @throws {DatabaseError} if inserting into database fails
 */
export async function addUser(
	username: string,
	email: string,
	password: string,
): Promise<void> {
	const usersCollection = getUserCollection();

	//validate each individually for more robust error handling.
	if (!(await validateUtils.isValidUsername(username))) {
		const responseMessage = "Username is invalid: " + username;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	if (!(await validateUtils.isValidEmail(email))) {
		const responseMessage = "Email is invalid: " + email;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	//Dont show password in error message for security.
	if (!(await validateUtils.isValidPassword(password))) {
		const responseMessage =
			"Password is invalid, enter a stronger password with at least 8 characters containing lowercase, uppercase, 1 number and 1 symbol";
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	// Fast-fail duplicate username/email before hashing to avoid hanging inserts
	const duplicate = await usersCollection.findOne(
		{ $or: [{ email }, { username }] },
		{ collation: { locale: "en", strength: 1 }, maxTimeMS: 1000 },
	);
	if (duplicate) {
		const duplicateField = duplicate.email === email ? "Email" : "Username";
		const duplicateValue =
			duplicateField === "Email" ? duplicate.email : duplicate.username;
		const responseMessage =
			duplicateField + " is already in use: " + duplicateValue;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const newUser: User = {
		username: username,
		email: email,
		password: hashedPassword,
		role: "user" // Default role for new users
	};
	try {
		//try to insert the user
		await usersCollection.insertOne(newUser, {
			// small timeout to keep tests from hanging on stalled writes
			maxTimeMS: 3000,
		});
	} catch (err) {
		const error = err as MongoServerError;
		if (error instanceof MongoServerError && error.code === 11000) {
			const duplicateField =
				error.keyPattern?.email != null ? "Email" : "Username";
			const duplicateValue =
				(error.keyValue?.email as string | undefined) ??
				(error.keyValue?.username as string | undefined) ??
				(duplicateField === "Email" ? email : username);
			const responseMessage =
				duplicateField + " is already in use: " + duplicateValue;
			logger.error(responseMessage);
			throw new InvalidInputError(responseMessage);
		}
		logger.error(error.message);
		throw new DatabaseError(
			"Error inserting user into database: " + error.message,
		);
	}
}

/**
 * returns the user object with the passed username if it exists
 * @param username
 * @returns returns user object, null if it doesn't exist in collection
 * @throws {DatabaseError} when getting user from database fails
 * @throws {InvalidInputError} when user was not found in database
 */
export async function getSingleUser(username: string): Promise<User> {
	const usersCollection = getUserCollection();

	let foundUser: User | null;
	try {
		//try to find user, incase of database error
		foundUser = await usersCollection.findOne({ username: username });
	} catch (err) {
		const error = err as Error;
		logger.error(error.message);
		throw new DatabaseError(
			"Error getting user " + username + "from database: " + error.message,
		);
	}
	//if user doesn't exist in collection throw an exception
	if (foundUser == null) {
		const responseMessage = "User " + username + " was not found in database";
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}
	return foundUser;
}

/**
 * calls collection.find() and returns an array of user objects.
 * @returns an array object containing the user objects in the collection
 * @throws {DatabaseError} when there is an error getting from the database
 */
export async function getAllUsers(): Promise<User[]> {
	const usersCollection = getUserCollection();

	let cursor;
	try {
		cursor = await usersCollection.find();
	} catch (err) {
		const error = err as Error;
		logger.error(error.message);
		throw new DatabaseError(
			"Error getting all users from database: " + error.message,
		);
	}
	return await cursor.toArray();
}

/**
 * Deletes the user with the passed username from the collection. Throws if the user doesn't exist
 * @param username
 * @throws {InvalidInputError} when the user wasn't found in the database
 * @throws {DatabaseError} when there is an error deleting from the database
 */
export async function deleteSingleUser(username: string): Promise<void> {
	const usersCollection = getUserCollection();

	let deletedUser;
	try {
		//try to delete the user
		deletedUser = await usersCollection.deleteOne({ username: username });
	} catch (err) {
		const error = err as Error;
		logger.error(error.message);
		throw new DatabaseError(
			"Error deleting user " + username + "from database: " + error.message,
		);
	}
	//Checks to see if the user was deleted
	if (deletedUser.deletedCount == 0) {
		const responseMessage = "User " + username + " not found and wasn't deleted";
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}
}

/**
 * Updates the user with the passed username with the new details passed in the parameters.
 * Throws an error if the user doesn't exist or if input is invalid
 * @param username current username that you want to update
 * @param newUsername
 * @param email new email
 * @param password new password
 * @throws {InvalidInputError} when the username/email/password are invalid or if username/email is in use or if username was not found
 * @throws {DatabaseError} if there was an error updating the database
 */
export async function updateSingleUser(
	username: string,
	newUsername: string,
	email: string,
	password: string,
): Promise<void> {
	const usersCollection = getUserCollection();

	let updatedUser;
	//validate users input

	if (!(await validateUtils.isValidUsername(newUsername))) {
		const responseMessage =
			"Cannot update user " + username + " Username is invalid: " + newUsername;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	if (!(await validateUtils.isValidEmail(email))) {
		const responseMessage =
			"Cannot update user " + username + " Email is invalid: " + email;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	//Don't show password in error message for security.
	if (!(await validateUtils.isValidPassword(password))) {
		const responseMessage =
			"Cannot update user " +
			username +
			" Password is invalid, enter a stronger password with at least 8 characters containing lowercase, uppercase, 1 number and 1 symbol";
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	// Ensure user exists and target username/email are not already taken by others
	const existingUser = await usersCollection.findOne(
		{ username },
		{ collation: { locale: "en", strength: 1 } },
	);
	if (!existingUser) {
		const responseMessage =
			"User " + username + " not found and wasn't updated with " + newUsername;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	const duplicate = await usersCollection.findOne(
		{
			$or: [{ email }, { username: newUsername }],
			username: { $ne: username },
		},
		{ collation: { locale: "en", strength: 1 } },
	);
	if (duplicate) {
		const duplicateField = duplicate.email === email ? "Email" : "Username";
		const duplicateValue =
			duplicateField === "Email" ? duplicate.email : duplicate.username;
		const responseMessage =
			"Cannot update user " +
			username +
			" " +
			duplicateField.toLowerCase() +
			" is already in use: " +
			duplicateValue;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	//Update the user
	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		updatedUser = await usersCollection.updateOne(
			{ username: username },
			{ $set: { username: newUsername, email: email, password: hashedPassword } },
			{ maxTimeMS: 3000 },
		);
	} catch (err) {
		const error = err as MongoServerError;
		if (error instanceof MongoServerError && error.code === 11000) {
			const duplicateField =
				error.keyPattern?.email != null ? "Email" : "Username";
			const duplicateValue =
				(error.keyValue?.email as string | undefined) ??
				(error.keyValue?.username as string | undefined) ??
				(duplicateField === "Email" ? email : newUsername);
			const responseMessage =
				"Cannot update user " +
				username +
				" " +
				duplicateField.toLowerCase() +
				" is already in use: " +
				duplicateValue;
			logger.error(responseMessage);
			throw new InvalidInputError(responseMessage);
		}
		logger.error(error.message);
		throw new DatabaseError(
			"Error updating user " + username + " in database: " + error.message,
		);
	}
	//Checks to see if the user was updated
	if (updatedUser.modifiedCount == 0) {
		const responseMessage =
			"User " + username + " not found and wasn't updated with " + newUsername;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}
}
