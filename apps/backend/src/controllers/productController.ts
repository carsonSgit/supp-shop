import express, { Request, Response } from "express";
import { DatabaseError } from "../models/DatabaseError";
import { InvalidInputError } from "../models/InvalidInputError";
const router = express.Router();
const routeRoot = "/products";
import * as model from "../models/workoutMongoDb";
import logger from "../logger";
import { requireAdmin } from "../middleware/adminAuth";
import { productCreateSchema, productUpdateSchema } from "../validators/productSchema";
import { ZodError } from "zod";

/**
 * Function that adds a product to the database through POST
 * using the 'BODY' parameters
 * @param request
 * @param response
 */

// If content type is post call createProduct
// Protect CREATE route with admin auth
router.post("/", requireAdmin, createProduct);

async function createProduct(request: Request, response: Response): Promise<void> {
	try {
		const parsed = productCreateSchema.parse(request.body);
		const { flavour, type, price, description, ingredients, nutrition, benefits, rating } = parsed;
		// async add product to MongoDB database
		const added = await model.addProduct(flavour, type, price, description, ingredients, nutrition, benefits, rating);

		if (added) {
			logger.info("Successfully added a product");
			response.status(200);
			response.send(added);
		} else {
			logger.info("Unexpected failure to add product");
			response.status(400);
			response.send("Failed to add product for unexpected reason");
		}
	} catch (err) {
		if (err instanceof ZodError) {
			response.status(400);
			response.send(err.flatten());
		} else if (err instanceof InvalidInputError) {
			response.status(400);
			response.send(err.message);
		}
		// If there was an Database error caught in addProduct,
		// send to 500 page with error message
		else if (err instanceof DatabaseError) {
			response.status(500);
			response.send(err.message);
		}
		// Unknown/unexpected error occurred...
		else {
			const error = err as Error;
			response.status(500);
			response.send("Unknown error: " + error.message);
		}
	}
}

/**
 * Function that uses the getAllProducts() function to retrieve an array
 * of all products currently in the database.
 * @param request
 * @param response
 */
// If content type is get call followed by /all use getAllProduct
router.get("/all", getAllProduct);

async function getAllProduct(_request: Request, response: Response): Promise<void> {
	// Get the product from the database
	let foundProduct = await model.getAllProducts();

	// If returns a null value display that there was no successful match

	if (foundProduct == null) {
		response.status(400);
		response.send("Product database was empty.");
	}
	// Otherwise, display the product found in the database
	else {
		/*let printString = "";
		for(let i=0; i<foundProduct.length; i++){
			printString += "<br>Flavour: " + foundProduct[i].flavour + " Type: "
			+ foundProduct[i].type + " Price: $" + foundProduct[i].price;
		}*/
		response.status(200);
		response.send(foundProduct);
	}
}

/**
 * Function that uses the getSingleProduct() function with a URL parameter to retrieve
 * a product from the database.
 * @param request
 * @param response
 */
// If content type is get call getOneProduct
router.get("/:flavour", getOneProduct);

async function getOneProduct(request: Request, response: Response): Promise<void> {
	// Assign the flavour-to-be-searched to the given request flavour
	const flavour = request.params.flavour;
	// If no flavour parameter is given, display error and do not continue
	if (flavour === undefined || flavour === null) {
		response.status(400);
		response.send("Error: No product name inputted.");
	}
	// Otherwise...
	else {
		try {
			// Get the product from the database
			const foundProduct = await model.getSingleProduct(flavour);

			// If returns a null value display that there was no successful match

			if (foundProduct == null) {
				response.status(400);
				response.send("Product " + flavour + " was not found.");
			}
			// Otherwise, display the product found in the database
			else {
				response.status(200);
				response.send(foundProduct);
			}
		} catch (err) {
			if (err instanceof InvalidInputError) {
				response.status(400);
				logger.info(err.message);
				response.send("Error: Invalid input, please try with a flavour");
			} else {
				const error = err as Error;
				logger.info("Unexpected error: " + error.message);
				response.status(500);
				response.send("Unexpected error: " + error.message);
			}
		}
	}
}

/**
 * Function that uses the updateOneProduct() function with JSON body parameters
 * to update a specified product from the database.
 * @param request
 * @param response
 */
// If content type is get put getOneProduct
// Protect UPDATE route with admin auth
router.put("/", requireAdmin, updateProduct);
async function updateProduct(request: Request, response: Response): Promise<void> {
	try {
		const parsed = productUpdateSchema.parse(request.body);
		const { flavour, type, updatePrice } = parsed;

		const updated = await model.updateOneProduct({ flavour, type }, { price: updatePrice });
		if (updated) {
			logger.info("Successfully updated a product");
			response.status(200);
			response.send(updated);
		} else {
			logger.info("Invalid price inputted to updateOneProduct()");
			response.status(400);
			response.send("Failed to update product for invalid input reason");
		}
	} catch (err) {
		if (err instanceof ZodError) {
			response.status(400);
			response.send(err.flatten());
		} else if (err instanceof DatabaseError) {
			logger.info(err.message);
			response.status(500);
			response.send(err.message);
		} else {
			const error = err as Error;
			logger.info(error.message);
			response.status(500);
			response.send("Unexpected error occurred: " + error.message);
		}
	}
}

/**
 * Function that uses the deleteOneProduct() function with a JSON body parameter
 * to delete a specified product from the database.
 * @param request
 * @param response
 */
// If content type is delete call getOneProduct
// Protect DELETE route with admin auth
router.delete("/", requireAdmin, deleteProduct);
async function deleteProduct(request: Request, response: Response): Promise<void> {
	const flavour = request.body.flavour;
	try {
		const updated = await model.deleteOneProduct(flavour);
		if (updated) {
			logger.info("Successfully deleted a product");
			response.status(200);
			response.send(updated);
		} else {
			logger.info("Invalid flavour inputted to deleteOneProduct()");
			response.status(400);
			response.send("Failed to delete product for invalid input reason");
		}
	} catch (err) {
		if (err instanceof DatabaseError) {
			logger.info(err.message);
			response.status(500);
			response.send(err.message);
		} else {
			const error = err as Error;
			logger.info(error.message);
			response.status(500);
			response.send("Unexpected error occurred: " + error.message);
		}
	}
}

export { router, routeRoot };

