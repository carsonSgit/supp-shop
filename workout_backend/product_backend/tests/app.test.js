require ('dotenv').config();
const model = require('../models/productModelMongoDb.js')
const utils = require('../models/validateUtils.js')
const db = "unitTestDB";
jest.setTimeout(5000);
const app = require("../app");
const supertest = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const testRequest = supertest(app);
let mongod;

const productData = [
    { flavour: "Chocolate", type: "Protein-powder", price: "49.99"},
    { flavour: "Natural", type: "Protein-powder", price: "59.99"},
    { flavour: "BlueRazz", type: "Pre-workout", price: "63.99"},
    { flavour: "Strawberry", type: "Protein-powder", price: "60.00"},
    { flavour: "Vanilla", type: "Protein-powder", price: "35.00"},
    { flavour: "SourApple", type: "Pre-workout", price: "45.99"},
  ];
  
  
  /**
   * Finds a pokemon from the pokemon array
   * @returns A pokemon from the array of example pokemon
   */
  const generateProductData = () => {
    const index = Math.floor(Math.random() * productData.length);
    return productData.slice(index, index + 1)[0];
  };

beforeEach(async () => {
    try{
        const url = mongod.getUri();
        await model.initialize(url,db,true);
    }
    catch(err){
        console.log(err.message);
    }
});
afterEach(async () => {
    await model.close();
});
beforeAll(async()=>{
    mongod = await MongoMemoryServer.create();
    console.log("Mock Database started");
});
afterAll(async()=>{
    await mongod.stop();
    console.log("Mock Database stopped");
});


// Can successfully retrieve a specified pokemon from the database
test("GET /products success case", async() =>{
    const {flavour,type,price} = generateProductData();
    await model.addProduct(flavour,type,price);

    await model.getSingleProduct({flavour:flavour});

    const testResponse = await testRequest.get("/products/" + flavour);
    expect(testResponse.status).toBe(200);
});
// Will fail retrieving invalid specified product from database
test("GET /products fail case", async() =>{
    const {flavour,type,price} = generateProductData();
    await model.addProduct(flavour,type,price);

    await model.getSingleProduct({flavour:flavour});

    const testResponse = await testRequest.get("/products/" + undefined);
    expect(testResponse.status).toBe(400);
});
// Can successfully retrieve all product objects from the database
test("GET /products/all success case", async() =>{
    const {flavour, type, price} = generateProductData();
    await model.addProduct(flavour,type,price);
    await model.addProduct(flavour,type,"100");
    await model.addProduct(flavour,type,"200");
    await model.addProduct(flavour,type,"300");

    
    const testResponse = await testRequest.get("/products/all");
    expect(testResponse.status).toBe(200);

    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(4);
    expect(results[0].flavour.toLowerCase() == flavour.toLowerCase()).toBe(true);
    expect(results[1].flavour.toLowerCase() == flavour.toLowerCase()).toBe(true);
    expect(results[2].flavour.toLowerCase() == flavour.toLowerCase()).toBe(true);
    expect(results[3].flavour.toLowerCase() == flavour.toLowerCase()).toBe(true);
});
// Can successfully add a single product object to the database
test("POST /products success case", async() =>{
    const {flavour, type, price} = generateProductData();
    const testResponse = await testRequest.post("/products").send({
        flavour,
        type,
        price,
    });
    expect(testResponse.status).toBe(200);
    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].flavour.toLowerCase() == flavour.toLowerCase()).toBe(true);
    expect(results[0].type.toLowerCase() == type.toLowerCase()).toBe(true);
    expect(results[0].price == price).toBe(true);
});
// Will successfully throw an error when trying to create invalid product
test("POST /products failure case", async() =>{
    const {flavour, type, price} = generateProductData();
    const testResponse = await testRequest.post("/products").send({
        flavour:null,
        type,
        price,
    });
    expect(testResponse.status).toBe(400);
});
// Can successfully update a single product object within the database
test("PUT /products success case", async() => {
    let updatePrice = "10000";
    const {flavour, type, price} = generateProductData();
    await model.addProduct(flavour,type,price);
    const testResponse = await testRequest.put("/products").send({
        flavour,
        type,
        price,
        updatePrice
    });
    expect(testResponse.status).toBe(200);
    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].flavour.toLowerCase() == flavour.toLowerCase()).toBe(true);
    expect(results[0].type.toLowerCase() == type.toLowerCase()).toBe(true);
    expect(results[0].price == updatePrice).toBe(true);
});
// Can successfully delete a single product object within the database
test("DELETE /products success case", async() => {
    const {flavour, type, price} = generateProductData();
    await model.addProduct(flavour,type,price);
    const testResponse = await testRequest.delete("/products").send({
        flavour,
    });
    expect(testResponse.status).toBe(200);
    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
    expect(results[0]).toBe(undefined);
});
// Input error throws error in controller
test("400-level error case", async() =>{
    const {flavour, type, price} = generateProductData();
    const testResponse = await testRequest.post("/products").send({
        flavour: null,
        type: type,
        price: price,
    });
    expect(testResponse.status).toBe(400);
});
// Database error due to access a closed DB
test("500-level error case", async() =>{
    await model.close();
    const {flavour, type, price} = generateProductData();
    const testResponse = await testRequest.post("/products").send({
        flavour,
        type,
        price,
    });
    expect(testResponse.status).toBe(500);
});