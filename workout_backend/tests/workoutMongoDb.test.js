const model = require('../models/workoutMongoDb');
const valUtils = require('../models/validateUtils');
const { InvalidInputError } = require('../models/InvalidInputError');
const { DatabaseError } = require('../models/DatabaseError');
const { MongoMemoryServer } = require('mongodb-memory-server');
const GenerateUsername = require("unique-username-generator");
const dbName = "user_db_test";

require('dotenv').config();

jest.setTimeout(50000);

//Set up mongodb in memory
let mongod;

beforeAll(async () => {
    //this will create a new instance of "MongoMemoryServer" and automatically start it
    mongod = await MongoMemoryServer.create();
    console.log("Mock Database started");
});

afterAll(async () => {
    await mongod.stop(); //Stop the MongoMemoryServer
    console.log("Mock Database stopped");
});


const generateUserData = () => {
    const username = GenerateUsername.generateUsername();
    const email = username+"@gmail.com";
    const password =  "@TestPwd33!!";

    return {name: username, email: email, password: password};
}

beforeEach(async () =>{
    try{
        const url = mongod.getUri();
        await model.initialize(dbName,true,url,["users"]);
    }catch(err){
        console.log(err.message);
    }
});

afterEach(async () =>{
    await model.close();
});

//#region Adding Tests
test('can add a user to DB',async () =>{

    const {name,email,password} = generateUserData();
    await model.addUser(name,email,password);

    let cursor = await model.getCollection();
    cursor = cursor.find();

    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == name.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email.toLowerCase()).toBe(true);

});

test("Cannot add same user twice to DB",async() =>{

    const {name,email,password} = generateUserData();
    await model.addUser(name,email,password);

    let cursor = await model.getCollection();
    cursor = cursor.find();

    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == name.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email.toLowerCase()).toBe(true);

    await expect(model.addUser(name,email,password)).rejects.toThrowError(InvalidInputError);

});

test("Cannot add user with invalid email",async() =>{

    const badEmail="badEmail";
    const {name,email,password} = generateUserData();
    await expect(model.addUser(name,badEmail,password)).rejects.toThrowError(InvalidInputError);
}
);

test("Cannot add user with weak password",async() =>{
    const weakPassword="weakPwd";
    const {name,email,password} = generateUserData();
    await expect(model.addUser(name,email,weakPassword)).rejects.toThrowError(InvalidInputError);
});

test("Cannot add user with empty password",async() =>{
    const {name,email,password} = generateUserData();
    await expect(model.addUser(name,email,"")).rejects.toThrowError(InvalidInputError);
});

test("Cannot add user with empty name",async() =>{
    const {name,email,password} = generateUserData();
    await expect(model.addUser("",email,password)).rejects.toThrowError(InvalidInputError);
});

//#endregion

//#region Getting Tests
test("Can get all users from DB",async() =>{
    let cursor = await model.getCollection();

    const {name,email,password} = generateUserData();    
    await cursor.insertOne({username: name, email: email, password:password});

    const {name: name2, email: email2,password: password2} = generateUserData();
    await cursor.insertOne({username: name2, email: email2, password:password2});

    const users = await model.getAllUsers();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    expect(users[0].username.toLowerCase() == name.toLowerCase()).toBe(true);
    expect(users[0].email.toLowerCase() == email.toLowerCase()).toBe(true);

    expect(users[1].username.toLowerCase() == name2.toLowerCase()).toBe(true);
    expect(users[1].email.toLowerCase() == email2.toLowerCase()).toBe(true);
});

test("Cannot get all users from DB with no users",async() =>{
    const users = await model.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(0);
});

test("Can get a single user from DB",async() =>{
    let cursor = await model.getCollection();

    const {name,email,password} = generateUserData();
    cursor.insertOne({username: name, email: email, password: password});

    const user = await model.getSingleUser(name);

    expect(user.username.toLowerCase() == name.toLowerCase()).toBe(true);
    expect(user.email.toLowerCase() == email.toLowerCase()).toBe(true);
});

test("Cannot get a single user from DB with no user",async() =>{
    await expect(model.getSingleUser("")).rejects.toThrowError(InvalidInputError);
});

//#endregion

//#region Delete tests
test("Can delete a user from DB",async() =>{
    let cursor = await model.getCollection();

    const {name,email,password} = generateUserData();
    await cursor.insertOne({username: name, email: email, password: password});

    await model.deleteSingleUser(name);

    cursor = cursor.find();
    const results = await cursor.toArray();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
});

test("Cannot delete a user from DB with no user",async() =>{
    await expect(model.deleteSingleUser("")).rejects.toThrowError(InvalidInputError);
});

//#endregion


//#region Update tests
test("Can update a user in DB",async() =>{
    let cursor = await model.getCollection();
    const {name,email,password} = generateUserData();
    await cursor.insertOne({username: name, email:email, password:password});

    const {name: name2,email: email2,password: password2} = generateUserData();
    await model.updateSingleUser(name,name2,email2,password2);

    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(results[0].username.toLowerCase() == name2.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email2.toLowerCase()).toBe(true);
});

test("Cannot update a user in DB with no user",async() =>{

    const {name,email,password} = generateUserData();
    await expect(model.updateSingleUser("",name,email,password)).rejects.toThrowError(InvalidInputError);
});

//#endregion