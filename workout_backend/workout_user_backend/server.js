//#region Assignment 2
const app = require("./app.js");
const http = require('http');
const {Db} = require('mongodb');
const port = 1339;
const dbName = "workout_user_db";
const {InvalidInputError} = require("./models/InvalidInputError");
const{DatabaseError} = require("./models/DatabaseError");

require('dotenv').config();

//Variables used for initialize call
const model = require("./models/workoutMongoDb");
const url = process.env.URL_PRE + process.env.MONGODB_PWD + process.env.URL_POST;

model.initialize("workout_user_db",false,url)
    .then(
        app.listen(port) // run the server
    );

//#endregion

//Old way of doing things, want to separate the logic of starting server versus setting up express
//#region Assignment 1
/* 
initialized = model.initialize(dbName,false,url);

http.createServer(async function (request,response){
    await initialized;
    response.writeHead(200,{'Content-Type':'text/plain'});

    response.write("ADDING USERS =================================================================");
    response.write("\n");
    response.write(await handleAddUser("Bobby","Bobby@gmail.com","Raabgoqwnrn!332$"));
    response.write("\n");
    response.write(await handleAddUser("Bobby","Bob@gmail.com","Raabgoqwnrn!332$"));
    response.write("\n");
    response.write(await handleAddUser("","dog@gmail.com","Raabgoqwnrn!332$"));
    response.write("\n");
    response.write(await handleAddUser("Cat","cat","Raabgoqwnrn!332$"));
    response.write("\n");
    response.write(await handleAddUser("bob123","robert@gmail.com","bobspwd"));
    response.write("\n");
    response.write(await handleAddUser("William","Will@gmail.com",""));
    response.write("\n\n");    


    response.write("GETTING SINGLE USER =================================================================");
    response.write("\n");
    response.write(await handleGetUser("Bobby"));
    response.write("\n");
    response.write(await handleGetUser("Franklin"));
    response.write("\n\n");

    response.write("GETTING ALL USERS =================================================================");
    response.write("\n");
    response.write(await handleGetAllUsers());
    response.write("\n\n");

    response.write("DELETING SINGLE USER =================================================================");
    response.write("\n");
    response.write(await handleDeleteSingleUser("Bobby"));
    response.write("\n");
    response.write(await handleDeleteSingleUser("Franklin"));
    response.write("\n\n");

    response.write("UPDATING USER =================================================================");
    response.write("\n");
    response.write(await handleAddUser("Bobby","Bobby@gmail.com","Raabgoqwnrn!332$"));
    response.write("\n");
    response.write(await handleUpdateUser("Bobby",{username:"Greg",email:"efpyi@example.com",password:"newSecurePwd123!@"}));
    response.write("\n");
    response.write(await handleUpdateUser("",{username:"Greg",email:"efpyi@example.com",password:"newSecurePwd123!@"}));
    response.write("\n\n");
    response.end('Goodbye');
}).listen(port);
*/
//#endregion

//#region Handle functions
/**
 * Adds user to collection and returns a string with the result,whether it was successful or not.
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 * @returns String with result of adding user
 */
async function handleAddUser(username,email,password){
    try{
        //add the user and return successful string if exception wasn't thrown
        await model.addUser(username,email,password);
        return "User "+ username+" added successfully";

    }catch(err){

        //Check type of error for robustness
        if(err instanceof InvalidInputError){
            console.log("Invalid Input: "+err.message);
            return "Invalid Input: "+err.message;
        }

        if(err instanceof DatabaseError){
            console.log("Database Error: "+err.message);
        }
        else{
            console.log("Unexpected Error: "+err.message);
        }

        return "Error adding user: "+username;
    }
}

/**
 * Deletes user from collection and returns a string with the result, whether it was successful or not.
 * @param {String} username 
 * @returns String with result of deleting user
 */
async function handleGetUser(username){
    try{
        //try getting the user, return whether it was found or not. If no exception was thrown
        let user = await model.getSingleUser(username);
        return "User "+username+" found with email: "+user.email;

    }catch(err){

        //check type of error for robustness
        if(err instanceof InvalidInputError){
            console.log("Invalid Input: "+err.message);
            return "Invalid Input: "+err.message;
        }

        if(err instanceof DatabaseError){
            console.log("Database Error: "+err.message);
        }
        else{
            console.log("Unexpected Error: "+err.message);
        }

        return "Error getting user: "+username;
    }
}

/**
 * Gets all users in collection and returns a string with the result, whether it was successful or not.
 * @returns String with all users in collection
 */
async function handleGetAllUsers(){
    let userArray;
    try{
        //get the array of users from collection and log a table to console
    userArray = await model.getAllUsers();
    console.table(userArray);
    }catch(err){
        console.log(err);
    }

    //Return a string with all the users appended
    let listOfUsers="";
    for(let i = 0; i < userArray.length;i++){
        listOfUsers+= (i+1)+". User found: "+userArray[i].username+" with email " + userArray[i].email+"\n";
    }
    //incase the collection is empty
    if(listOfUsers==""){
        listOfUsers="No users in collection\n";
    }
    return listOfUsers;
}

/**
 * Deletes user from collection and returns a string with the result, whether it was successful or not.
 * @param {String} username 
 * @returns String with result of deleting user
 */
async function handleDeleteSingleUser(username){
    try{
        //try deleting the user from collection with the passed username
        await model.deleteSingleUser(username);
        return "User "+username+" deleted successfully";

    }catch(err){

        //check type of error for robustness
        if(err instanceof InvalidInputError){
            console.log("Invalid Input: "+err.message);
            return "Invalid Input: "+err.message;
        }

        if(err instanceof DatabaseError){
            console.log("Database Error: "+err.message);
        }
        else{
            console.log("Unexpected Error: "+err.message);
        }

        return "Error deleting user: "+username;
    }

}

/**
 * Updates user in collection and returns a string with the result, whether it was successful or not.
 * @param {String} username 
 * @param {String} newUser 
 * @returns String with result of updating user
 */
async function handleUpdateUser(username,newUser){
    try{
        //try to update specified username in collection with the new user object passed.
        await model.updateSingleUser(username,newUser.username,newUser.email,newUser.password);
        return "User "+username+" updated successfully to "+newUser.username;

    }catch(err){

        //check type of error for robustness
        if(err instanceof InvalidInputError){
            console.log("Invalid Input: "+err.message);
            return "Invalid Input: "+err.message;
        }

        if(err instanceof DatabaseError){
            console.log("Database Error: "+err.message);
        }
        else{
            console.log("Unexpected Error: "+err.message);
        }

        return "Error updating user: "+username;
    }
}
//#endregion