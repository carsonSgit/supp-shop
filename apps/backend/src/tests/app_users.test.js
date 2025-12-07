const model = require("../models/workoutMongoDb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const GenerateUsername = require("unique-username-generator");
const app = require("../app").default;
const supertest = require("supertest");
const { createSession } = require("../controllers/Session");
const bcrypt = require("bcrypt");
const testRequest = supertest(app);
const dbName = "user_db_test";

require("dotenv").config();

jest.setTimeout(30000);

let mongod;
let adminCookie;

const generateUserData = () => {
	const username = GenerateUsername.generateUsername();
	const email = username + "@gmail.com";
	const password = "@TestPwd33!!";

	return { username: username, email: email, password: password };
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
	await model.initialize(dbName, true, url, ["users"]);
	adminCookie = await seedAdminSession();
});

afterEach(async () => {
	await model.close();
});

//#region GET TESTS

test("GET /users returns user details for admin", async () => {
	const { username, email, password } = generateUserData();
	await model.addUser(username, email, password);

	const testResponse = await testRequest
		.get("/users/" + username)
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(200);
	expect(testResponse.body.username).toBe(username);
});

test("GET /users returns 400 when user missing", async () => {
	const testResponse = await testRequest
		.get("/users/missing")
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(400);
});

test("GET /users requires authentication", async () => {
	const response = await testRequest.get("/users/anyone");
	expect(response.status).toBe(401);
});

test("GET /users/all returns all users", async () => {
	const first = generateUserData();
	const second = generateUserData();
	await model.addUser(first.username, first.email, first.password);
	await model.addUser(second.username, second.email, second.password);

	const testResponse = await testRequest
		.get("/users/all")
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(200);
	expect(testResponse.body.length).toBe(2);
});

test("GET /users/all returns 500 when db closed", async () => {
	await model.close();
	const testResponse = await testRequest
		.get("/users/all")
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(500);
});
//#endregion

//#region Post tests
test("POST /users creates a user", async () => {
	const { username, email, password } = generateUserData();
	const testResponse = await testRequest
		.post("/users")
		.set("Cookie", adminCookie)
		.send({
			username,
			email,
			password,
		});
	expect(testResponse.status).toBe(200);
	const results = await (await model.getUserCollection()).find().toArray();

	expect(results).toHaveLength(2); // admin + new user
	expect(results.some((u) => u.username === username)).toBe(true);
});

test("POST /users validates input", async () => {
	const { email, password } = generateUserData();
	const invalidUsername = "";
	const invalidEmail = "invalidEmail.com";
	const invalidPassword = "qwerty";

	expect(
		(
			await testRequest
				.post("/users")
				.set("Cookie", adminCookie)
				.send({ username: invalidUsername, email, password })
		).status,
	).toBe(400);

	expect(
		(
			await testRequest
				.post("/users")
				.set("Cookie", adminCookie)
				.send({ username: "good", email: invalidEmail, password })
		).status,
	).toBe(400);

	expect(
		(
			await testRequest
				.post("/users")
				.set("Cookie", adminCookie)
				.send({ username: "good", email, password: invalidPassword })
		).status,
	).toBe(400);
});

test("POST /users requires authentication", async () => {
	const { username, email, password } = generateUserData();
	const response = await testRequest.post("/users").send({
		username,
		email,
		password,
	});
	expect(response.status).toBe(401);
});

test("POST /users returns 500 when database closed", async () => {
	const { username, email, password } = generateUserData();
	await model.close();
	const testResponse = await testRequest
		.post("/users")
		.set("Cookie", adminCookie)
		.send({
			username,
			email,
			password,
		});
	expect(testResponse.status).toBe(500);
});
//#endregion

//#region PUT tests

test("PUT /users updates user info", async () => {
	const { username: oldUsername, email, password } = generateUserData();
	await model.addUser(oldUsername, email, password);

	const {
		username: newUsername,
		email: newEmail,
		password: newPassword,
	} = generateUserData();
	const testResponse = await testRequest
		.put("/users/" + oldUsername)
		.set("Cookie", adminCookie)
		.send({
			username: newUsername,
			email: newEmail,
			password: newPassword,
		});
	expect(testResponse.status).toBe(200);

	const users = await (await model.getUserCollection()).find().toArray();
	const updated = users.find((u) => u.username === newUsername);
	expect(updated).toBeDefined();
	expect(await bcrypt.compare(newPassword, updated.password)).toBe(true);
});

test("PUT /users returns 400 for invalid email", async () => {
	const { username: oldUsername, email, password } = generateUserData();
	await model.addUser(oldUsername, email, password);

	const testResponse = await testRequest
		.put("/users/" + oldUsername)
		.set("Cookie", adminCookie)
		.send({
			username: "newName",
			email: "badEmail",
			password: "@TestPwd44!!",
		});
	expect(testResponse.status).toBe(400);
});

test("PUT /users returns 500 when db closed", async () => {
	const { username: oldUsername, email, password } = generateUserData();
	await model.addUser(oldUsername, email, password);
	await model.close();
	const testResponse = await testRequest
		.put("/users/" + oldUsername)
		.set("Cookie", adminCookie)
		.send({
			username: "newName",
			email: "new@example.com",
			password: "@TestPwd44!!",
		});
	expect(testResponse.status).toBe(500);
});
//#endregion

//#region DELETE tests

test("DELETE /users removes a user", async () => {
	const { username, email, password } = generateUserData();
	await model.addUser(username, email, password);

	const testResponse = await testRequest
		.delete("/users/" + username)
		.set("Cookie", adminCookie);
	expect(testResponse.status).toBe(200);

	const results = await (await model.getUserCollection()).find().toArray();
	expect(results.find((u) => u.username === username)).toBeUndefined();
});

test("DELETE /users returns 400 for missing user", async () => {
	const response = await testRequest
		.delete("/users/not-here")
		.set("Cookie", adminCookie);
	expect(response.status).toBe(400);
});

test("DELETE /users returns 500 when database closed", async () => {
	const { username, email, password } = generateUserData();
	await model.addUser(username, email, password);
	await model.close();
	const response = await testRequest
		.delete("/users/" + username)
		.set("Cookie", adminCookie);
	expect(response.status).toBe(500);
});
//#endregion
