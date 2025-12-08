import { Collection } from "mongodb";
import { InvalidInputError } from "./InvalidInputError";
import { DatabaseError } from "./DatabaseError";
import * as validateUtils from "./validateUtils";
import { Product } from "../types/models.types";
import { getProductsCollection } from "./database";

export async function addProduct(
	flavour: string,
	type: "Pre-workout" | "Protein-powder",
	price: number,
	description?: string,
	ingredients?: string[],
	nutrition?: { calories: number; protein: number; carbs: number; fat: number },
	benefits?: string[],
	rating?: number
): Promise<Product> {
	const productsCollection = getProductsCollection();

	let newProduct: Product;
	if (await validateUtils.isValidProduct(flavour, type, price)) {
		newProduct = {
			flavour: flavour,
			type: type,
			price: price,
			description: description,
			ingredients: ingredients,
			nutrition: nutrition,
			benefits: benefits,
			rating: rating
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
	const productsCollection = getProductsCollection();

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
	const productsCollection = getProductsCollection();

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
	const productsCollection = getProductsCollection();

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
	const productsCollection = getProductsCollection();

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
