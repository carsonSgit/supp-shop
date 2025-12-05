import { MongoClient, Db, Collection } from "mongodb";
import { InvalidInputError } from "./InvalidInputError";
import { DatabaseError } from "./DatabaseError";
import * as validateUtils from "./validateUtils";
import logger from "../logger";
import bcrypt from "bcrypt";
import { User, Product, Order } from "../types/models.types";

const saltRounds = 10;

let client: MongoClient | null = null;
let db: Db | null = null;

let usersCollection: Collection<User> | null = null;
let productsCollection: Collection<Product> | null = null;
let ordersCollection: Collection<Order> | null = null;

/**
 *
 * Connect to the MongoDb cluster based on .env details
 * Use the database with the name stored in dbName and the collection "users"
 * If the flag is set to true, drop the collection "users" and recreate it with a collation of strength 1
 *
 * @param dbName Name of the database you want to connect to
 * @param resetFlag If set to true, the collection is dropped
 * @param url the url to the database from the .env details
 * @param collectionNames the name of the collection you want to connect
 * @throws {DatabaseError} when there is an error connecting to the mongo db.
 */
export async function initialize(
	dbName: string,
	resetFlag: boolean,
	url: string,
	collectionNames: string[],
): Promise<void> {
	for (let i = 0; i < collectionNames.length; i++) {
		try {
			logger.info("Attempting to connect to " + dbName);
			//store connected client for use while the app is running
			client = new MongoClient(url);
			await client.connect();
			logger.info("Connected to MongoDb");
			db = client.db(dbName);

			//Check to see if the users collection exists
			const collectionCursor = await db.listCollections({
				name: collectionNames[i],
			});
			const collectionArray = await collectionCursor.toArray();

			//if it exists and flag is set to true then drop the collection
			if (resetFlag && collectionArray.length > 0)
				await db.collection(collectionNames[i]).drop();

			if (collectionArray.length == 0 || resetFlag) {
				//collation specifying case-insensitive collection
				const collation = { locale: "en", strength: 1 };
				//no match was found so create new collection
				await db.createCollection(collectionNames[i], { collation: collation });
			}
			//convenient access to collection
			if (collectionNames[i] === "users")
				usersCollection = db.collection(collectionNames[i]) as Collection<User>;
			else if (collectionNames[i] === "products")
				productsCollection = db.collection(
					collectionNames[i],
				) as Collection<Product>;
			else if (collectionNames[i] === "orders")
				ordersCollection = db.collection(collectionNames[i]) as Collection<Order>;
		} catch (err) {
			const error = err as Error;
			logger.error(error.message);
			throw new DatabaseError("Error accessing MongoDB: " + error.message);
		}
	}
}

//#region CRUD Operations

//////////////////////////////////////////////////////// USERS CRUD //////////////////////////////////////////////////////////////////
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
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}

	let newUser: User;

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

	//Check if user or email already exists in collection
	if (await isEmailInUse(email)) {
		const responseMessage = "Email is already in use: " + email;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	if (await isUsernameInUse(username)) {
		const responseMessage = "Username is already in use: " + username;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}
	//insert the new user into the collection
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	newUser = { 
		username: username, 
		email: email, 
		password: hashedPassword,
		role: "user" // Default role for new users
	};
	try {
		//try to insert the user
		await usersCollection.insertOne(newUser);
	} catch (err) {
		const error = err as Error;
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
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}

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
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}

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
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}

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
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}

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

	if (await isEmailInUse(email)) {
		const responseMessage =
			"Cannot update user " + username + " Email is already in use: " + email;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	if (await isUsernameInUse(newUsername)) {
		const responseMessage =
			"Cannot update user " +
			username +
			" Username is already in use: " +
			newUsername;
		logger.error(responseMessage);
		throw new InvalidInputError(responseMessage);
	}

	//Update the user
	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		updatedUser = await usersCollection.updateOne(
			{ username: username },
			{ $set: { username: newUsername, email: email, password: hashedPassword } },
		);
	} catch (err) {
		const error = err as Error;
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

//////////////////////////////// ORDERS CRUD //////////////////////////////////
/**
 * adds a new order to the database
 * @param orderId | id of the order that was placed
 * @param price | price of the order
 * @returns the order object that will be added
 * @throws {InvalidInputError} When orderid and/or price are incorrectly formatted
 * @throws {DatabaseError} When you cannot access the database or
 */
export async function addOrder(orderId: string, price: number): Promise<Order> {
	if (!ordersCollection) {
		throw new DatabaseError("Orders collection not initialized");
	}

	try {
		const pass = await validateUtils.isValidOrder(
			parseInt(orderId),
			price,
		);
		// prevents adding duplicate order IDs
		const duplicateOrderId = await ordersCollection.findOne({
			orderId: orderId,
		});
		if (pass == true && !duplicateOrderId) {
			const orderToAdd: Order = { orderId: orderId, price: price };
			const result = await ordersCollection.insertOne(orderToAdd);
			if (!result) {
				logger.debug("The order was not added");
				throw new InvalidInputError("could not add");
			}
			return orderToAdd;
		} else {
			logger.debug("The order id entered was incorrect");
			throw new InvalidInputError("Invalid order");
		}
	} catch (error) {
		if (error instanceof InvalidInputError) {
			logger.warn("There was invlid input in adding this order");
			throw error;
		} else {
			const err = error as Error;
			logger.error(err.message);
			throw new DatabaseError("could not add order to the database");
		}
	}
}

/**
 * function that gets one order from the database using the order's id
 * @param orderId | id of the order to look for
 * @returns the order object you are looking for
 * @throws {InvalidInputError} When orderid is incorrectly formatted or does not exist in the database
 * @throws {DatabaseError} when you cannot access the database
 */
export async function getOneOrder(orderId: string): Promise<Order> {
	if (!ordersCollection) {
		throw new DatabaseError("Orders collection not initialized");
	}

	try {
		const parsedOrderId = parseInt(orderId);
		if (parsedOrderId < 0) {
			logger.debug("Invalid order id entered " + orderId);
			throw new InvalidInputError("The order id you entered was not valid");
		}
		const result = await ordersCollection.findOne({ orderId: orderId });

		if (!result) {
			logger.debug("Order does not exist in database");
			throw new InvalidInputError(
				"could not find the order you asked for in the database",
			);
		}

		return result;
	} catch (error) {
		if (error instanceof InvalidInputError) {
			logger.error(error.message);
			throw error;
		} else {
			const err = error as Error;
			logger.error(err.message);
			throw new DatabaseError("Database error");
		}
	}
}

/**
 * function that gets all of the orders in the database
 * @returns an array of all the orders
 * @throws {DatabaseError} When you cannot access the database
 */
export async function GetAllOrders(): Promise<Order[]> {
	if (!ordersCollection) {
		throw new DatabaseError("Orders collection not initialized");
	}

	try {
		const allOrdersFound = await ordersCollection.find();

		if (!allOrdersFound) {
			logger.debug("Access to the database was impossible or it may not exist");
			throw new DatabaseError(
				"could not access the database or it does not exist",
			);
		}

		const allOrdersArray = await allOrdersFound.toArray();

		return allOrdersArray;
	} catch (err) {
		if (err instanceof DatabaseError) {
			logger.error(err.message);
			throw err;
		}
		const error = err as Error;
		throw new DatabaseError(error.message);
	}
}

/**
 * function that finds one order and replaces it using the order id
 * @param orderId | original id of the order
 * @param newOrderId | the new order id
 * @param newPrice | the new price of the order
 * @returns the replaced order object
 * @throws {InvalidInputError} When orderid and/or price are incorrectly formatted
 * @throws {DatabaseError} When access to the database
 */
export async function replaceOrder(
	orderId: string,
	newOrderId: string,
	newPrice: number,
): Promise<Order> {
	if (!ordersCollection) {
		throw new DatabaseError("Orders collection not initialized");
	}

	try {
		const pass = await validateUtils.isValidOrder(
			parseInt(newOrderId),
			newPrice,
		);

		const existingOrder = await ordersCollection.findOne({ orderId: orderId });
		if (!existingOrder) {
			logger.debug(
				"The order id that is being looked for does not exist in the database",
			);
			throw new InvalidInputError(
				"The order Id you want to change from is not in the database",
			);
		} else {
			if (pass) {
				const result = await ordersCollection.findOneAndReplace(
					{ orderId: orderId },
					{ orderId: newOrderId, price: newPrice },
					{ returnDocument: "after" },
				);
				if (!result.value) {
					throw new DatabaseError("Failed to replace order");
				}
				return result.value;
			} else {
				logger.debug("The order could not be updated in the database");
				throw new InvalidInputError("could not update order in database");
			}
		}
	} catch (error) {
		if (error instanceof InvalidInputError) {
			logger.error(error.message);
			throw error;
		} else {
			const err = error as Error;
			logger.error(err.message);
			throw new DatabaseError(err.message);
		}
	}
}

/**
 * function that deletes a specific order depending on its id
 * @param orderId | id of the order to delete
 * @returns the deleted order object
 * @throws {InvalidInputError} When the order id entered is formatted incorrectly
 */
export async function deleteOrder(orderId: string): Promise<{ deletedCount: number }> {
	if (!ordersCollection) {
		throw new DatabaseError("Orders collection not initialized");
	}

	try {
		const parsedOrderId = parseInt(orderId);
		if (parsedOrderId > 0 && parsedOrderId != null) {
			const result = await ordersCollection.deleteOne({ orderId: orderId });
			if (result.deletedCount === 0) {
				logger.debug("order id does not exist in database");
				throw new InvalidInputError("The orderid you entered is inexistant");
			}
			return result;
		} else {
			throw new InvalidInputError("the order id you entered was invalid");
		}
	} catch (error) {
		if (error instanceof InvalidInputError) {
			logger.error(error.message);
			throw error;
		} else {
			const err = error as Error;
			logger.error(err.message);
			throw new DatabaseError("could not delete order from the database");
		}
	}
}

//////////////////////////////////////////////////////////////// PRODUCTS CRUD //////////////////////////////////////////////////////////////////

export async function addProduct(
	flavour: string,
	type: "Pre-workout" | "Protein-powder",
	price: number,
	description?: string,
): Promise<Product> {
	if (!productsCollection) {
		throw new DatabaseError("Products collection not initialized");
	}

	let newProduct: Product;
	if (await validateUtils.isValidProduct(flavour, type, price)) {
		newProduct = {
			flavour: flavour,
			type: type,
			price: price,
			description: description,
		};
	} else {
		throw new InvalidInputError("Product values invalid");
	}

	try {
		await productsCollection.insertOne(newProduct);
		return newProduct;
	} catch (err) {
		const error = err as Error;
		throw new DatabaseError("Can't insert product to database: " + error.message);
	}
}

export async function getSingleProduct(flavour: string): Promise<Product> {
	if (!productsCollection) {
		throw new DatabaseError("Products collection not initialized");
	}

	try {
		if (!flavour) {
			throw new InvalidInputError("Error: No flavour specified");
		}
		const query = { flavour: flavour };
		const done = await productsCollection.findOne(query);
		if (!done) {
			throw new InvalidInputError("Product not found");
		}
		return done;
	} catch (error) {
		if (error instanceof InvalidInputError) {
			throw error;
		}
		const err = error as Error;
		throw new DatabaseError(
			"Error: Execution of findOne() resulted in an error: " + err.message,
		);
	}
}

export async function getAllProducts(): Promise<Product[]> {
	if (!productsCollection) {
		throw new DatabaseError("Products collection not initialized");
	}

	try {
		const cursor = await productsCollection.find({});
		const allProduct = await cursor.toArray();
		return allProduct;
	} catch (err) {
		if (err instanceof DatabaseError) {
			throw new DatabaseError(err.message);
		}
		const error = err as Error;
		console.log(error.message);
		throw new DatabaseError(error.message);
	}
}

/**
 * Checks validity of an object with the updated price,
 * if valid, updates the product in the "products" collection
 * @param update
 * @param updateValue
 * @returns true if successfully updated the product
 * @returns false if update failed
 */
export async function updateOneProduct(
	update: { flavour: string; type: "Pre-workout" | "Protein-powder" },
	updateValue: { price: number },
): Promise<boolean> {
	if (!productsCollection) {
		throw new DatabaseError("Products collection not initialized");
	}

	try {
		let product;
		if (
			await validateUtils.isValidProduct(
				update.flavour,
				update.type,
				updateValue.price,
			)
		) {
			product = await productsCollection.updateOne(
				{ flavour: update.flavour },
				{
					$set: {
						flavour: update.flavour,
						type: update.type,
						price: updateValue.price,
					},
				},
			);
		}
		if (product != undefined && product.modifiedCount > 0) {
			return true;
		}
		return false;
	} catch (err) {
		if (err instanceof DatabaseError) {
			console.log("Error: Database error when executing update");
			throw err;
		}
		const error = err as Error;
		throw new DatabaseError(error.message);
	}
}

/**
 * Attempts to delete a product from the "products" collection according to the given flavour
 * @param deleteProduct
 * @returns false if delete failed
 * @returns true if successfully deleted the product
 * @error DatabaseError if there is an error deleting the product from the database
 * @error InvalidInputError if the input was invalid (null or undefined)
 */
export async function deleteOneProduct(deleteProduct: string): Promise<boolean> {
	if (!productsCollection) {
		throw new DatabaseError("Products collection not initialized");
	}

	let test;
	try {
		test = await productsCollection.deleteOne({ flavour: deleteProduct });
		if (test.deletedCount == 0) {
			return false;
		}
		return true;
	} catch (err) {
		const error = err as Error;
		console.log("Could not delete product: " + error.message);
		if (err instanceof DatabaseError) {
			console.log("Could not access the database: " + error.message);
			throw new DatabaseError("Could not access the database: " + error.message);
		}
		if (err instanceof InvalidInputError) {
			console.log("Invalid input: " + error.message);
			throw new InvalidInputError("Invalid input: " + error.message);
		}
		console.log("Unexpected error: " + error.message);
		throw new Error("Unexpected error: " + error.message);
	}
}

//#endregion CRUD Operations

/**
 * Returns the users collection
 * @returns the users collection if not null
 */
export async function getUserCollection(): Promise<Collection<User> | null> {
	return usersCollection;
}

/**
 * Returns the products collection
 * @returns the products collection if not null
 */
export async function getProductsCollection(): Promise<Collection<Product> | null> {
	return productsCollection;
}

/**
 * Returns the orders collection
 * @returns the orders collection if not null
 */
export async function getOrdersCollection(): Promise<Collection<Order> | null> {
	return ordersCollection;
}

//#region Helper functions

/**
 * Checks if the passed email is already in use
 * @param email
 * @returns true if email is already in use, false if it isn't
 */
async function isEmailInUse(email: string): Promise<boolean> {
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}

	const user = await usersCollection.findOne({ email: email });

	if (user == null) {
		return false;
	}
	return true;
}

/**
 * Checks if the passed username is already in use
 * @param username
 * @returns true if username is already in use, false if it isn't
 */
async function isUsernameInUse(username: string): Promise<boolean> {
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}

	const user = await usersCollection.findOne({ username: username });
	if (user == null) {
		return false;
	}
	return true;
}

/**
 * Closes the connection to the database
 */
export async function close(): Promise<void> {
	try {
		if (client) {
			await client.close();
			logger.info("MongoDB connection closed");
		}
	} catch (err) {
		const error = err as Error;
		logger.error(error.message);
	}
}
//#endregion Helper functions

