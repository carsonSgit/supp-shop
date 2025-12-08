import { Collection } from "mongodb";
import { InvalidInputError } from "./InvalidInputError";
import { DatabaseError } from "./DatabaseError";
import * as validateUtils from "./validateUtils";
import logger from "../logger";
import { Order } from "../types/models.types";
import { getOrdersCollection } from "./database";

/**
 * adds a new order to the database
 * @param orderId | id of the order that was placed
 * @param price | price of the order
 * @returns the order object that will be added
 * @throws {InvalidInputError} When orderid and/or price are incorrectly formatted
 * @throws {DatabaseError} When you cannot access the database or
 */
export async function addOrder(orderId: string, price: number): Promise<Order> {
	const ordersCollection = getOrdersCollection();

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
	const ordersCollection = getOrdersCollection();

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
	const ordersCollection = getOrdersCollection();

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
	const ordersCollection = getOrdersCollection();

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
	const ordersCollection = getOrdersCollection();

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
