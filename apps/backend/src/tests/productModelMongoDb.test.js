require("dotenv").config();
const model = require("../models/workoutMongoDb");
const { InvalidInputError } = require("../models/InvalidInputError");
const { MongoMemoryServer } = require("mongodb-memory-server");

const db = "unitTestDB";
jest.setTimeout(10000);
let mongod;

const productData = [
	{ flavour: "Chocolate", type: "Protein-powder", price: 49.99 },
	{ flavour: "Natural", type: "Protein-powder", price: 59.99 },
	{ flavour: "BlueRazz", type: "Pre-workout", price: 63.99 },
	{ flavour: "Strawberry", type: "Protein-powder", price: 60 },
	{ flavour: "Vanilla", type: "Protein-powder", price: 35 },
	{ flavour: "SourApple", type: "Pre-workout", price: 45.99 },
];

const sampleProduct = () => {
	const index = Math.floor(Math.random() * productData.length);
	return productData[index];
};

async function readProducts() {
	const collection = await model.getProductsCollection();
	const cursor = collection?.find();
	return cursor ? cursor.toArray() : [];
}

beforeAll(async () => {
	mongod = await MongoMemoryServer.create();
	console.log("Mock Database started");
});

afterAll(async () => {
	await mongod.stop();
	console.log("Mock Database stopped");
});

beforeEach(async () => {
	const url = mongod.getUri();
	await model.initialize(db, true, url, ["products"]);
});

afterEach(async () => {
	await model.close();
});

test("addProduct persists product with optional fields", async () => {
	const { flavour, type, price } = sampleProduct();
	const product = await model.addProduct(flavour, type, price, "desc", ["ing1"], {
		calories: 10,
		protein: 1,
		carbs: 2,
		fat: 0,
	});

	expect(product.flavour).toBe(flavour);
	const products = await readProducts();
	expect(products).toHaveLength(1);
	expect(products[0].type).toBe(type);
	expect(products[0].price).toBe(price);
});

test("addProduct rejects invalid payload", async () => {
	await expect(
		model.addProduct("", "Pre-workout", 10),
	).rejects.toBeInstanceOf(InvalidInputError);
});

test("getSingleProduct returns inserted product", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);
	const found = await model.getSingleProduct(flavour);
	expect(found.flavour).toBe(flavour);
});

test("getSingleProduct throws for missing product", async () => {
	await expect(model.getSingleProduct("ghost")).rejects.toBeInstanceOf(
		InvalidInputError,
	);
});

test("updateOneProduct updates price", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);
	const updated = await model.updateOneProduct(
		{ flavour, type },
		{ price: 100 },
	);
	expect(updated).toBe(true);
	const products = await readProducts();
	expect(products[0].price).toBe(100);
});

test("deleteOneProduct removes existing product", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);
	const deleted = await model.deleteOneProduct(flavour);
	expect(deleted).toBe(true);
	expect(await readProducts()).toHaveLength(0);
});

test("deleteOneProduct returns false when nothing deleted", async () => {
	expect(await model.deleteOneProduct("NOT A PRODUCT")).toBe(false);
});

test("getAllProducts returns all stored products", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);
	await model.addProduct("Vanilla", "Protein-powder", 25);
	await model.addProduct("SourApple", "Pre-workout", 30);

	const products = await model.getAllProducts();
	expect(products).toHaveLength(3);
	expect(products.map((p) => p.flavour)).toEqual(
		expect.arrayContaining(["Vanilla", flavour, "SourApple"]),
	);
});
