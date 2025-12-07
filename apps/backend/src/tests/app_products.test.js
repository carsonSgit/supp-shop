require("dotenv").config();
const model = require("../models/workoutMongoDb");
const db = "unitTestDB";
jest.setTimeout(10000);
const app = require("../app").default;
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { createSession } = require("../controllers/Session");
const bcrypt = require("bcrypt");
const testRequest = supertest(app);
let mongod;
let adminCookie;

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

async function seedAdminSession() {
	const users = await model.getUserCollection();
	const hashed = await bcrypt.hash("AdminPass1!", 10);
	await users.insertOne({
		username: "admin",
		email: "admin@example.com",
		password: hashed,
		role: "admin",
	});
	const sessionId = createSession("admin", 5);
	return [`sessionId=${sessionId}`];
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
	await model.initialize(db, true, url, ["users", "products"]);
	adminCookie = await seedAdminSession();
});

afterEach(async () => {
	await model.close();
});

test("GET /products returns a stored product", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);

	const testResponse = await testRequest.get("/products/" + flavour);
	expect(testResponse.status).toBe(200);
	expect(testResponse.body.flavour).toBe(flavour);
});

test("GET /products returns 400 when product not found", async () => {
	const testResponse = await testRequest.get("/products/ghost");
	expect(testResponse.status).toBe(400);
});

test("GET /products/all returns all products", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);
	await model.addProduct("Vanilla", "Protein-powder", 100);
	await model.addProduct("SourApple", "Pre-workout", 200);

	const testResponse = await testRequest.get("/products/all");
	expect(testResponse.status).toBe(200);
	expect(Array.isArray(testResponse.body)).toBe(true);
	expect(testResponse.body.length).toBe(3);
});

test("POST /products creates a product with admin auth", async () => {
	const { flavour, type, price } = sampleProduct();
	const testResponse = await testRequest
		.post("/products")
		.set("Cookie", adminCookie)
		.send({
			flavour,
			type,
			price,
			description: "Tasty",
			rating: 4.5,
		});
	expect(testResponse.status).toBe(201);
	expect(testResponse.headers.location).toContain(flavour);
	const results = await (await model.getProductsCollection()).find().toArray();

	expect(results).toHaveLength(1);
	expect(results[0].flavour).toBe(flavour);
	expect(results[0].type).toBe(type);
	expect(results[0].price).toBe(price);
});

test("POST /products rejects invalid payload", async () => {
	const testResponse = await testRequest
		.post("/products")
		.set("Cookie", adminCookie)
		.send({
			flavour: "",
			type: "Protein-powder",
			price: 10,
		});
	expect(testResponse.status).toBe(400);
});

test("POST /products requires authentication", async () => {
	const { flavour, type, price } = sampleProduct();
	const testResponse = await testRequest.post("/products").send({
		flavour,
		type,
		price,
	});
	expect(testResponse.status).toBe(401);
});

test("PUT /products updates price with admin auth", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);
	const testResponse = await testRequest
		.put("/products")
		.set("Cookie", adminCookie)
		.send({
			flavour,
			type,
			updatePrice: 10000,
		});
	expect(testResponse.status).toBe(200);
	const results = await (await model.getProductsCollection()).find().toArray();

	expect(results).toHaveLength(1);
	expect(results[0].price).toBe(10000);
});

test("DELETE /products removes a product with admin auth", async () => {
	const { flavour, type, price } = sampleProduct();
	await model.addProduct(flavour, type, price);
	const testResponse = await testRequest
		.delete("/products")
		.set("Cookie", adminCookie)
		.send({
			flavour,
		});
	expect(testResponse.status).toBe(200);
	const results = await (await model.getProductsCollection()).find().toArray();
	expect(results).toHaveLength(0);
});

test("POST /products returns 500 when database is closed", async () => {
	await model.close();
	const { flavour, type, price } = sampleProduct();
	const testResponse = await testRequest
		.post("/products")
		.set("Cookie", adminCookie)
		.send({
			flavour,
			type,
			price,
		});
	expect(testResponse.status).toBe(500);
});
