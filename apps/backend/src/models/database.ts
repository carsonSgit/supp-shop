import { MongoClient, Db, Collection } from "mongodb";
import logger from "../logger";
import { User, Product, Order } from "../types/models.types";
import { DatabaseError } from "./DatabaseError";

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
			// Keep server selection timeout low so tests fail fast if a temp
			// in-memory Mongo instance is unexpectedly unavailable.
			// SRV URIs (mongodb+srv://) don't support directConnection
			const isSrvUri = url.startsWith("mongodb+srv://");
			const clientOptions: {
				serverSelectionTimeoutMS: number;
				socketTimeoutMS: number;
				directConnection?: boolean;
			} = {
				serverSelectionTimeoutMS: 2000,
				socketTimeoutMS: 2000,
			};
			if (!isSrvUri) {
				clientOptions.directConnection = true;
			}
			client = new MongoClient(url, clientOptions);
			await client.connect();
			logger.info("Connected to MongoDb");
			db = client.db(dbName);

			//Check to see if the users collection exists
			const collectionCursor = await db.listCollections({
				name: collectionNames[i],
			});
			const collectionArray = await collectionCursor.toArray();
			const collation = { locale: "en", strength: 1 };

			//if it exists and flag is set to true then drop the collection
			if (resetFlag && collectionArray.length > 0)
				await db.collection(collectionNames[i]).drop();

			if (collectionArray.length == 0 || resetFlag) {
				//collation specifying case-insensitive collection
				//no match was found so create new collection
				await db.createCollection(collectionNames[i], { collation: collation });
			}
			//convenient access to collection
			if (collectionNames[i] === "users") {
				usersCollection = db.collection(collectionNames[i]) as Collection<User>;
				await usersCollection.createIndex(
					{ email: 1 },
					{ unique: true, collation: collation },
				);
				await usersCollection.createIndex(
					{ username: 1 },
					{ unique: true, collation: collation },
				);
			} else if (collectionNames[i] === "products")
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
	} finally {
		// ensure a clean slate for tests between runs
		client = null;
		db = null;
		usersCollection = null;
		productsCollection = null;
		ordersCollection = null;
	}
}

/**
 * Returns the users collection
 * @returns the users collection if not null
 */
export function getUserCollection(): Collection<User> {
	if (!usersCollection) {
		throw new DatabaseError("Users collection not initialized");
	}
	return usersCollection;
}

/**
 * Returns the products collection
 * @returns the products collection if not null
 */
export function getProductsCollection(): Collection<Product> {
	if (!productsCollection) {
		throw new DatabaseError("Products collection not initialized");
	}
	return productsCollection;
}

/**
 * Returns the orders collection
 * @returns the orders collection if not null
 */
export function getOrdersCollection(): Collection<Order> {
	if (!ordersCollection) {
		throw new DatabaseError("Orders collection not initialized");
	}
	return ordersCollection;
}
