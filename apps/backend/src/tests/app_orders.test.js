jest.setTimeout(60000);
const model = require("../models/workoutMongoDb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app").default;
const supertest = require("supertest");
const { createSession } = require("../controllers/Session");
const bcrypt = require("bcrypt");
const testRequest = supertest(app);
const dbName = "testOrders_db";
let mongod;
let adminCookie;

async function seedAdminSession() {
	const users = await model.getUserCollection();
	const hashed = await bcrypt.hash("AdminPass1!", 10);
	await users.insertOne({
		username: "admin",
		email: "admin@example.com",
		password: hashed,
		role: "admin",
	});
	return [`sessionId=${createSession("admin", 5)}`];
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
	await model.initialize(dbName, true, url, ["users", "orders"]);
	adminCookie = await seedAdminSession();
});

afterEach(async () => {
	await model.close();
});

// ======================================================================================================

test("GET /orders/:orderId returns an order when authenticated", async () => {
	const orderId = "04";
	const price = 17;

	await model.addOrder(orderId, price);

	const testResponse = await testRequest
		.get("/orders/" + orderId)
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(200);
	expect(testResponse.body.orderId).toBe(orderId);
});

test("GET /orders/:orderId returns 400 for invalid id", async () => {
	const testResponse = await testRequest
		.get("/orders/" + -1)
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(400);
});

test("GET /orders/:orderId returns 401 without auth", async () => {
	const response = await testRequest.get("/orders/123");
	expect(response.status).toBe(401);
});

test("GET /orders lists all orders", async () => {
	await model.addOrder("17", 32);
	await model.addOrder("1", 23);

	const testResponse = await testRequest
		.get("/orders")
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(200);
	expect(Array.isArray(testResponse.body)).toBe(true);
	expect(testResponse.body.length).toBe(2);
});

test("GET /orders returns 500 when db is closed", async () => {
	await model.close();

	const testResponse = await testRequest
		.get("/orders")
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(500);
});
// ======================================================================================================

test("POST /orders creates an order", async () => {
	const orderId = "7";
	const price = 13;

	const testResponse = await testRequest
		.post("/orders")
		.set("Cookie", adminCookie)
		.send({
			orderId: orderId,
			price: price,
		});

	expect(testResponse.status).toBe(200);

	const cursor = await model.getOrdersCollection();
	const results = await cursor.find().toArray();
	expect(results).toHaveLength(1);
	expect(results[0].orderId).toBe(orderId);
	expect(results[0].price).toBe(price);
});

test("POST /orders rejects invalid input", async () => {
	const testResponse = await testRequest
		.post("/orders")
		.set("Cookie", adminCookie)
		.send({
			orderId: "-7",
			price: 13,
		});

	expect(testResponse.status).toBe(400);
});

test("POST /orders returns 401 when unauthenticated", async () => {
	const testResponse = await testRequest.post("/orders").send({
		orderId: "17",
		price: 13,
	});

	expect(testResponse.status).toBe(401);
});

test("POST /orders returns 500 when database is closed", async () => {
	await model.close();
	const testResponse = await testRequest
		.post("/orders")
		.set("Cookie", adminCookie)
		.send({
			orderId: "17",
			price: 13,
		});

	expect(testResponse.status).toBe(500);
});

// ======================================================================================================

test("PUT /orders updates an order", async () => {
	const orderId = "04";
	const oldprice = 500;

	const newOrderId = "7";
	const price = 13;
	await model.addOrder(orderId, oldprice);

	const response = await testRequest
		.put("/orders/" + orderId)
		.set("Cookie", adminCookie)
		.send({ orderId: newOrderId, price: price });
	expect(response.status).toBe(200);
});

test("PUT /orders returns 400 for invalid input", async () => {
	const orderId = "04";
	const oldPrice = 37;
	const newOrderId = "-7";
	const price = 13;
	await model.addOrder(orderId, oldPrice);
	const response = await testRequest
		.put("/orders/" + orderId)
		.set("Cookie", adminCookie)
		.send({ orderId: newOrderId, price: price });
	expect(response.status).toBe(400);
});

test("PUT /orders returns 500 when db closed", async () => {
	const orderId = "04";
	const newOrderId = "7";
	const price = 13;
	await model.close();

	const response = await testRequest
		.put("/orders/" + orderId)
		.set("Cookie", adminCookie)
		.send({ orderId: newOrderId, price: price });
	expect(response.status).toBe(500);
});

// ======================================================================================================

test("DELETE /orders deletes an order", async () => {
	const orderId = "04";
	const price = 23;

	await model.addOrder(orderId, price);

	const response = await testRequest
		.delete("/orders/" + orderId)
		.set("Cookie", adminCookie);
	expect(response.status).toBe(200);
});

test("DELETE /orders returns 400 with invalid data", async () => {
	const invalidOrderId = "-2";
	const response = await testRequest
		.delete("/orders/" + invalidOrderId)
		.set("Cookie", adminCookie);
	expect(response.status).toBe(400);
});

test("DELETE /orders returns 500 when database closed", async () => {
	const orderId = "24";
	await model.close();
	const response = await testRequest
		.delete("/orders/" + orderId)
		.set("Cookie", adminCookie);
	expect(response.status).toBe(500);
});
