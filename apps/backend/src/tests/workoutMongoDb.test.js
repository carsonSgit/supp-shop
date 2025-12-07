const model = require("../models/workoutMongoDb");
const { InvalidInputError } = require("../models/InvalidInputError");
const { MongoMemoryServer } = require("mongodb-memory-server");
const GenerateUsername = require("unique-username-generator");
const bcrypt = require("bcrypt");

const dbName = "user_db_test";

require("dotenv").config();

jest.setTimeout(20000);
// Keep Mongo operations tight to avoid bun killing processes on slow tests
const OP_TIMEOUT_MS = 1500;

let mongod;

const generateUserData = () => {
	const username = GenerateUsername.generateUsername();
	const email = username + "@gmail.com";
	const password = "@TestPwd33!!";

	return { name: username, email: email, password: password };
};

async function getUsers() {
	const cursor = await model.getUserCollection();
	const results = await cursor.find().toArray();
	return results;
}

beforeAll(async () => {
	// Use a single in-memory server for the suite to avoid repeated startup
	// delays/timeouts on Windows.
	mongod = await MongoMemoryServer.create();
	console.log("Mock Database started");
});

beforeEach(async () => {
	const url = mongod.getUri();
	await model.initialize(dbName, true, url, ["users"]);
	const users = await model.getUserCollection();
	// ensure unique indexes exist before tests run
	await users.createIndex({ email: 1 }, { unique: true, collation: { locale: "en", strength: 1 } });
	await users.createIndex({ username: 1 }, { unique: true, collation: { locale: "en", strength: 1 } });
});

afterEach(async () => {
	await model.close();
});

afterAll(async () => {
	if (mongod) {
		try {
			// Skip filesystem cleanup to avoid EBUSY on Windows when Bun kills
			// background processes between tests.
			await mongod.stop({ doCleanup: false, timeout: OP_TIMEOUT_MS });
		} catch (err) {
			if (err && (err.code === "EBUSY" || err.code === "EPERM")) {
				console.warn("MongoMemoryServer cleanup skipped: temp files locked");
			} else {
				throw err;
			}
		}
		console.log("Mock Database stopped");
		mongod = undefined;
	}
});

//#region Adding Tests
test("addUser hashes password and stores defaults", async () => {
	const { name, email, password } = generateUserData();
	await model.addUser(name, email, password);

	const users = await getUsers();
	expect(users).toHaveLength(1);
	expect(users[0].username).toBe(name);
	expect(users[0].email).toBe(email);
	expect(users[0].role).toBe("user");
	expect(await bcrypt.compare(password, users[0].password)).toBe(true);
});

test("addUser rejects duplicates", async () => {
	const { name, email, password } = generateUserData();
	await model.addUser(name, email, password);
	await expect(model.addUser(name, email, password)).rejects.toThrow(
		InvalidInputError,
	);
});

test("addUser validates input", async () => {
	const { name, email, password } = generateUserData();
	await expect(model.addUser(name, "bad", password)).rejects.toThrow(
		InvalidInputError,
	);
	await expect(model.addUser("", email, password)).rejects.toThrow(
		InvalidInputError,
	);
	await expect(model.addUser(name, email, "weak")).rejects.toThrow(
		InvalidInputError,
	);
});
//#endregion

//#region Getting Tests
test("getAllUsers returns empty array when no users", async () => {
	const users = await model.getAllUsers();
	expect(users).toEqual([]);
});

test("getAllUsers returns stored users", async () => {
	const first = generateUserData();
	const second = generateUserData();
	await model.addUser(first.name, first.email, first.password);
	await model.addUser(second.name, second.email, second.password);

	const users = await model.getAllUsers();
	expect(users.map((u) => u.username)).toEqual(
		expect.arrayContaining([first.name, second.name]),
	);
});

test("getSingleUser returns existing user", async () => {
	const { name, email, password } = generateUserData();
	await model.addUser(name, email, password);
	const user = await model.getSingleUser(name);
	expect(user.username).toBe(name);
});

test("getSingleUser throws when user missing", async () => {
	await expect(model.getSingleUser("")).rejects.toThrow(InvalidInputError);
	await expect(model.getSingleUser("ghost")).rejects.toThrow(
		InvalidInputError,
	);
});
//#endregion

//#region Delete tests
test("deleteSingleUser removes existing user", async () => {
	const { name, email, password } = generateUserData();
	await model.addUser(name, email, password);
	await model.deleteSingleUser(name);

	const users = await getUsers();
	expect(users).toHaveLength(0);
});

test("deleteSingleUser throws for missing user", async () => {
	await expect(model.deleteSingleUser("")).rejects.toThrow(InvalidInputError);
});
//#endregion

//#region Update tests
test("updateSingleUser updates fields and hashes password", async () => {
	const original = generateUserData();
	await model.addUser(original.name, original.email, original.password);
	const updated = generateUserData();

	await model.updateSingleUser(
		original.name,
		updated.name,
		updated.email,
		updated.password,
	);

	const users = await getUsers();
	expect(users).toHaveLength(1);
	expect(users[0].username).toBe(updated.name);
	expect(users[0].email).toBe(updated.email);
	expect(await bcrypt.compare(updated.password, users[0].password)).toBe(true);
});

test("updateSingleUser validates input", async () => {
	const original = generateUserData();
	await model.addUser(original.name, original.email, original.password);

	await expect(
		model.updateSingleUser(original.name, "", original.email, original.password),
	).rejects.toThrow(InvalidInputError);
	await expect(
		model.updateSingleUser(
			original.name,
			original.name,
			"bad",
			original.password,
		),
	).rejects.toThrow(InvalidInputError);
});
//#endregion
