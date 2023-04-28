require ('dotenv').config();
const model = require('../models/productModelMongoDb')
const utils = require('../models/validateUtils.js');
const { InvalidInputError } = require("../models/InvalidInputError");
const db = "unitTestDB";
jest.setTimeout(5000);
const { MongoMemoryServer } = require('mongodb-memory-server');
const { DatabaseError } = require('../models/DatabaseError');
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
test('Can add product to DB', async () => {
    const {flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);

    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();
    
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].flavour.toLowerCase() == flavour.toLowerCase()).toBe(true);
    expect(results[0].type.toLowerCase() == type.toLowerCase()).toBe(true);
    expect(results[0].price == price).toBe(true);
});
test('Invalid product adding will throw InvalidInputError', async () => {
    let error=null;
    try {
      const { flavour, type,price } = generateProductData();
      await model.addProduct(null, type,price);
      
      let cursor = await model.getCollection();
      cursor = cursor.find();
      const results = await cursor.toArray();
    } catch (err) {
      error=err;
    }
    expect(error).toBeInstanceOf(InvalidInputError);
  });
test("Can find product from flavour name", async () => {
    const { flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);
    const foundProduct = await model.getSingleProduct(flavour);

    expect(flavour).toBe(foundProduct.flavour);
});
test("Can't find product that doesn't exist", async () => {
    const { flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);

    expect(await model.getSingleProduct("NO")).toBe(null);
});
test("Can replace existing product with new one", async () => {
    const { flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);
    await model.updateOneProduct({flavour:flavour,type:type,price:price},{price:"100"});

    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(results[0].price).toBe("100");
});
test("Can delete existing product", async () => {
    const { flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);
    await model.deleteOneProduct(flavour);

    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(results[0]).toBe(undefined);
});
test("Can't delete a non-existing product", async () => {
    const { flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);
    expect(await model.deleteOneProduct("NOT A PRODUCT")).toBe(false);
});
test("More than one product can be added to database & read (2)", async () => {
    const { flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);
    await model.addProduct(flavour, type, "100");

    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(results.length).toBe(2);
});
test("More than one product can be added to database & read (5)", async () => {
    const { flavour, type, price} = generateProductData();
    await model.addProduct(flavour, type, price);
    await model.addProduct(flavour, type, "100");
    await model.addProduct(flavour, type, "200");
    await model.addProduct(flavour, type, "300");
    await model.addProduct(flavour, type, "400");

    let cursor = await model.getCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(results.length).toBe(5);
});