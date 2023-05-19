jest.setTimeout(60000);
const model = require('../models/workoutMongoDb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require("../app");
const supertest = require("supertest");
const testRequest = supertest(app);
const dbName = 'testOrders_db';
let mongod;
/**
 * before each method
 */
beforeEach(async () => {
    const url = mongod.getUri();
    await model.initialize(dbName,true,url,['orders']);
});

beforeAll(async () => {
    // This will create a new instance of "MongoMemoryServer" and automatically start it
    mongod = await MongoMemoryServer.create();
    console.log("Mock Database started");
  });
  
  afterAll(async () => {  
    await mongod.stop(); // Stop the MongoMemoryServer
    console.log("Mock Database stopped");
  });
  
  
// ======================================================================================================

/**
 *  test method that checks for a successful retrival of an order
 */
test("GET /orders success (200) case", async () =>{


  const orderId = "04";
  const price = "17";

  await model.addOrder(orderId,price);
  
  const testResponse = await testRequest.get("/orders/" + orderId);
  expect(testResponse.status).toBe(200);
});

/**
 * Test method that checks if the user input is correct
 */
test("GET /orders incorrect input (400) case", async () =>
{
  const orderId = "7";
  const price = "12";
  const wrongOrderId = "8";

  await model.addOrder(orderId,price);
  const testResponse = await testRequest.get("/orders/"+ wrongOrderId);
  expect(testResponse.status).toBe(400);

});

/**
 * test method that checks if the database can be accessed
 */
test("GET /orders incorrect database (500) case", async () =>
{
  const orderId = "17";
  const price = "12";

  await model.addOrder(orderId,price);
  await model.close(); // Stop the MongoMemoryServer

  const testResponse = await testRequest.get("/orders/"+ orderId);
  expect(testResponse.status).toBe(500);

});

// ======================================================================================================

/**
 *  test method that checks for a successful retrival of an order
 */
test("GET /orders (all) success (200) case", async () =>{
  
  const orderId = "17";
  const price1 = "32";

  const orderId2 = "1";
  const price2 = "23";

  await model.addOrder(orderId,price1);
  await model.addOrder(orderId2,price2);

  const testResponse = await testRequest.get("/orders");
  expect(testResponse.status).toBe(200);
});

/**
 * test method that checks if the database can be accessed
 */
test("GET /orders (all) incorrect database (500) case", async () =>
{

  await model.close(); // Stop the MongoMemoryServer

  const testResponse = await testRequest.get("/orders");
  expect(testResponse.status).toBe(500);

});
// ======================================================================================================

/**
 * test method that checks for a successful post
 */
test("POST /orders success (200) case", async () => {
  const orderId = "7";
  const price = "13";

  const testResponse = await testRequest.post("/orders").send({
    orderId: orderId,
    price: price,
  });

  const postedOrder = await model.getOneOrder(orderId);
  console.log(postedOrder);
  expect(testResponse.status).toBe(200);

  const cursor = await model.getOrdersCollection();
  const results = await (cursor.find()).toArray();
  expect(Array.isArray(results)).toBe(true);
  expect(results.length).toBe(1);
  expect(results[0].orderId == orderId).toBe(true);
  expect(results[0].price == price).toBe(true);

});

/**
 * Test method that checks for an invalid input post
 */
test("POST /orders incorrect input case", async () => {
  const orderId = "-7";
  const price = "13";

  const testResponse = await testRequest.post("/orders").send({
    orderId: orderId,
    price: price,
  });


  expect(testResponse.status).toBe(400);
});


/**
 * Test method that checks for a level 500 error on post
 */
test("POST /orders incorrect database case", async () => {
  const orderId = "17";
  const price = "13";

  await model.close(); // Stop the MongoMemoryServer
  const testResponse = await testRequest.post("/orders").send({
    orderId: orderId,
    price: price,
  });


  expect(testResponse.status).toBe(500);
});

// ======================================================================================================

// Test for a successful PUT request (response status 200)
test("PUT request returns status 200", async () => {
  const orderId = "04";
  const oldprice = "500";


  const newOrderId = "7";
  const price = "13";
  await model.addOrder(orderId,oldprice);

  const response = await testRequest.put("/orders/" + orderId).send({  orderId: newOrderId,
    price: price, });
  expect(response.status).toBe(200);
});

/**
 * Test for a failed PUT request (response status 500)
 */
test("PUT request returns status 500", async () => {
  const orderId = "04";
  const newOrderId = "7";
  const price = "13";
  await model.close(); // Stop the MongoMemoryServer

  const response = await testRequest.put("/orders/" + orderId).send({ orderId: newOrderId,
    price: price,  });
  expect(response.status).toBe(500);
});

/**
 * Test for a failed PUT request (response status 400)
 */
test("PUT request returns status 400", async () => {
  const orderId = "04";
  const oldPrice = "37";
  const newOrderId = "-7";
  const price = "13";
  await model.addOrder(orderId,oldPrice);
  const response = await testRequest.put("/orders/" + orderId).send({ orderId: newOrderId,
    price: price,  });
  expect(response.status).toBe(400);
});

// ======================================================================================================

// Test for a successful DELETE request (response status 200)
test("DELETE request returns status 200", async () => {
  const orderId = "04"
  const price = "23";

  await model.addOrder(orderId,price);

  const response = await testRequest.delete("/orders/" + orderId);
  expect(response.status).toBe(200);
});

// Test for a failed DELETE request (response status 500)
test("DELETE request returns status 500", async () => {
  const orderId = "24"
  await model.close(); // Stop the MongoMemoryServer
  const response = await testRequest.delete("/orders/" + orderId);
  expect(response.status).toBe(500);
});

// Test for a DELETE request with invalid data (response status 400)
test("DELETE request returns status 400 with invalid data", async () => {

  const invalidOrderId = "-2"
  const response = await testRequest.delete("/orders/"+ invalidOrderId);
  expect(response.status).toBe(400);
});