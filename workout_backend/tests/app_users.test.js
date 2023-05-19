const model = require('../models/workoutMongoDb.js');
const valUtils = require('../models/validateUtils');
const { InvalidInputError } = require('../models/InvalidInputError');
const { DatabaseError } = require('../models/DatabaseError');
const { MongoMemoryServer } = require('mongodb-memory-server');
const GenerateUsername = require("unique-username-generator");
const app = require("../app");
const supertest = require("supertest");
const testRequest = supertest(app);
const dbName = "user_db_test";

require('dotenv').config();

jest.setTimeout(50000000);

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

    return {username: username, email: email, password: password};
}

beforeEach(async () =>{
    try{
        const url = mongod.getUri();
        await model.initialize(dbName,true,url,['users']);
    }catch(err){
        console.log(err.message);
    }
});

afterEach(async () =>{
    await model.close();
});


//#region GET TESTS

test("GET /users success case", async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();    
    await cursor.insertOne({username: username, email: email, password:password});

    try{
    testResponse = await testRequest.get('/users/'+username);
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(200);
});

test("GET /users failure case status 400 non-existing name on non-empty database",async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();    
    await cursor.insertOne({username:username, email: email, password:password});
    try{
        testResponse = await testRequest.get('/users/'+"random"); // invalid name
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(400);
});

test("GET /users failure case status 500",async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();
    await cursor.insertOne({username: username, email: email, password:password});

    await model.close();
    try{
        testResponse = await testRequest.get('/users/'+username);
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(500);
});

// /users/get-all doesn't have a case with a 400 response status, there is no input
test("GET /users/all success case", async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();
    await cursor.insertOne({username: username, email: email, password:password});

    const {username:username2,email:email2,password:password2} = generateUserData();
    await cursor.insertOne({username: username2, email: email2, password:password2});

    try{
        testResponse = await testRequest.get('/users/all');
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(200);
});

test("GET /users/get-all failure case status 500", async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();
    await cursor.insertOne({username: username, email: email, password:password});

    const {username:username2,email:email2,password:password2} = generateUserData();
    await cursor.insertOne({username: username2, email: email2, password:password2});

    await model.close();
    try{
        testResponse = await testRequest.get('/users/get-all');
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(500);
});
//#endregion

//#region Post tests
test("POST /users success case", async () => {
    const {username,email,password} = generateUserData();    
    testResponse = await testRequest.post("/users").send(
    {
        username:username,
        email:email,
        password:password
    });
    expect(testResponse.status).toBe(200);
    let cursor = await model.getUserCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == username.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email.toLowerCase()).toBe(true);
});

test("POST /users failure case status 400: invalid username", async () => {
    const {username,email,password} = generateUserData();    
    const invalidUsername = "";
    try{
            testResponse = await testRequest.post("/users").send(
        {
            username:invalidUsername,
            email:email,
            password:password
        });
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(400);

    let cursor = await model.getUserCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);

});

test("POST /users failure case status 400: invalid email", async () => {
    const {username,email,password} = generateUserData();    
    const invalidEmail = "invalidEmail.com";
    try{
            testResponse = await testRequest.post("/users").send(
        {
            username:username,
            email:invalidEmail,
            password:password
        });
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(400);    

    let cursor = await model.getUserCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);

});

test("POST /users failure case status 400: invalid password", async () => {
    const {username,email,password} = generateUserData();    
    const invalidPassword = "qwerty";
    try{
            testResponse = await testRequest.post("/users").send(
        {
            username:username,
            email:email,
            password:invalidPassword
        });
    }catch(err){
    console.log(err.message);
    }
    expect(testResponse.status).toBe(400);

    let cursor = await model.getUserCollection();
    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);

});

test("POST /users failure case status 500",async () => {
    const {username,email,password} = generateUserData();    
    await model.close();
    try{
            testResponse = await testRequest.post("/users").send(
        {
            username:username,
            email:email,
            password:password
        });
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(500);
});
//#endregion

//#region PUT tests

test("PUT /users success case", async () => {
    let cursor = await model.getUserCollection();

    const {username:oldUsername,email,password} = generateUserData();    
    await cursor.insertOne({username: oldUsername, email: email, password:password});

    const {username:newUsername,email:newEmail,password: newPassword} = generateUserData();    
    try{
        testResponse = await testRequest.put("/users/"+oldUsername).send({
        username:newUsername,
        email:newEmail,
        password:newPassword
    });
    }catch(err){
        console.log(err.message);
    }
    //ask do i need to do status check and db check?
    expect(testResponse.status).toBe(200);

    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == newUsername.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == newEmail.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == newPassword.toLowerCase()).toBe(true);
});

test("PUT /users failure case status 400: same username", async () => {
    let cursor = await model.getUserCollection();

    const {username:oldUsername,email,password} = generateUserData();    
    await cursor.insertOne({username: oldUsername, email: email, password:password});

    const {username:newUsername,email:newEmail,password: newPassword} = generateUserData();    
    try{
            testResponse = await testRequest.put("/users/"+oldUsername).send({
            username:oldUsername,
            email:newEmail,
            password:newPassword
        });
    }catch(err){
    console.log(err.message)
    }

    expect(testResponse.status).toBe(400);

    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == oldUsername.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == password.toLowerCase()).toBe(true);
});

test("PUT /users failure case status 400: invalid email", async () => {
    let cursor = await model.getUserCollection();

    const {username:oldUsername,email,password} = generateUserData();    
    await cursor.insertOne({username: oldUsername, email: email, password:password});

    const {username:newUsername,email:newEmail,password: newPassword} = generateUserData();    
    const invalidEmail = "invalidEmail.com";

    try{
            testResponse = await testRequest.put("/users/"+oldUsername).send({
            username:newUsername,
            email:invalidEmail,
            password:newPassword
        });
    }catch(err){
        console.log(err.message);
    }

    expect(testResponse.status).toBe(400);

    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == oldUsername.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == password.toLowerCase()).toBe(true);
    
    
});

test("PUT /users failure case status 400: invalid password", async () => {
    let cursor = await model.getUserCollection();

    const {username:oldUsername,email,password} = generateUserData();    
    await cursor.insertOne({username: oldUsername, email: email, password:password});

    const {username:newUsername,email:newEmail,password: newPassword} = generateUserData();    
    const invalidPassword = "qwerty";

    try{
            testResponse = await testRequest.put("/users/"+oldUsername).send({
            username:newUsername,
            email:newEmail,
            password:invalidPassword
        });
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(400);

    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == oldUsername.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == password.toLowerCase()).toBe(true);
});

test("PUT /users failure case 500 status", async () => {
    let cursor = await model.getUserCollection();

    const {username:oldUsername,email,password} = generateUserData();    
    await cursor.insertOne({username: oldUsername, email: email, password:password});

    const {username:newUsername,email:newEmail,password: newPassword} = generateUserData();    
    await model.close();
    try{
            testResponse = await testRequest.put("/users/"+oldUsername).send({
            username:newUsername,
            email:newEmail,
            password:newPassword
        });
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(500);
});

//#endregion

//#region DELETE tests

test("DELETE /users success case", async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();
    await cursor.insertOne({username: username, email: email, password:password});

    try{
        testResponse = await testRequest.delete("/users/"+username);
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(200);

    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
});

test("DELETE /users failure case status 400: non-existant username", async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();
    await cursor.insertOne({username: username, email: email, password:password});

    const badUsername = "badUsername";
    try{
        testResponse = await testRequest.delete("/users/"+badUsername);
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(400);

    cursor = cursor.find();
    const results = await cursor.toArray();

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0].username.toLowerCase() == username.toLowerCase()).toBe(true);
    expect(results[0].email.toLowerCase() == email.toLowerCase()).toBe(true);
    expect(results[0].password.toLowerCase() == password.toLowerCase()).toBe(true);
});

test("DELETE /users failure case status 500", async () => {
    let cursor = await model.getUserCollection();

    const {username,email,password} = generateUserData();
    await cursor.insertOne({username: username, email: email, password:password});

    await model.close();
    try{
        testResponse = await testRequest.delete("/users/"+username);
    }catch(err){
        console.log(err.message);
    }
    expect(testResponse.status).toBe(500);
});
//#endregion