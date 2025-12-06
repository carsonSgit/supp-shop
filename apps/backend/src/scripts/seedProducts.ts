import path from "path";
import dotenv from "dotenv";
import * as model from "../models/workoutMongoDb";
import logger from "../logger";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const url =
	process.env.MONGO_URL ||
	(process.env.URL_PRE && process.env.MONGODB_PWD && process.env.URL_POST
		? `${process.env.URL_PRE}${process.env.MONGODB_PWD}${process.env.URL_POST}`
		: "");

if (!url) {
	console.error(
		"Error: Missing Mongo connection details. Provide either MONGO_URL or URL_PRE + MONGODB_PWD + URL_POST in apps/backend/.env",
	);
	process.exit(1);
}

const seeds = [
	{
		flavour: "Raspberry",
		type: "Pre-workout" as const,
		price: 39.99,
		description: "Energizing raspberry pre-workout supplement",
		ingredients: ["Whey Protein Isolate", "Cocoa Powder", "Natural Flavors", "Stevia Leaf Extract", "Sea Salt"],
		benefits: ["Muscle Recovery", "Fast Absorption", "Great Taste", "Keto Friendly"],
		rating: 4.9,
		nutrition: { calories: 120, protein: 24, carbs: 3, fat: 1 },
	},
	{
		flavour: "Chocolate",
		type: "Protein-powder" as const,
		price: 49.99,
		description: "Rich chocolate protein powder for daily recovery",
		ingredients: ["Whey Protein Isolate", "Cocoa Powder", "Natural Flavors", "Stevia Leaf Extract", "Sea Salt"],
		benefits: ["Muscle Recovery", "Great Taste"],
		rating: 4.8,
		nutrition: { calories: 130, protein: 25, carbs: 4, fat: 2 },
	},
	{
		flavour: "Vanilla",
		type: "Protein-powder" as const,
		price: 49.99,
		description: "Smooth vanilla protein powder with clean ingredients",
		ingredients: ["Whey Protein Isolate", "Natural Flavors", "Stevia Leaf Extract", "Sea Salt"],
		benefits: ["Muscle Recovery", "Fast Absorption"],
		rating: 4.7,
		nutrition: { calories: 125, protein: 24, carbs: 3, fat: 1.5 },
	},
];

async function main() {
	const collectionNames = ["users", "products", "orders"];
	await model.initialize("workout_db", false, url, collectionNames);

	for (const seed of seeds) {
		try {
			await model.addProduct(
				seed.flavour,
				seed.type,
				seed.price,
				seed.description,
				seed.ingredients,
				seed.nutrition,
				seed.benefits,
				seed.rating,
			);
			logger.info(`Seeded product: ${seed.flavour}`);
		} catch (err) {
			const error = err as Error;
			logger.error(`Failed to seed ${seed.flavour}: ${error.message}`);
		}
	}

	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

