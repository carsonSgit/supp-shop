const {MongoClient}= require("mongodb");
const { InvalidInputError } = require("./InvalidInputError");
const { DatabaseError } = require("./DatabaseError");
const validateUtils=require("./validateUtils");
const logger = require("../logger");
const bcrypt=require('bcrypt');
const saltRounds=10;

let client;

let usersCollection;
let productsCollection;
let ordersCollection;


/**
 * 
 * Connect to the MongoDb cluster based on .env details
 * Use the database with the name stored in dbName and the collection "users"
 * If the flag is set to true, drop the collection "users" and recreate it with a collation of strength 1
 * 
 * @param {string} dbName Name of the database you want to connect to
 * @param {boolean} resetFlag If set to true, the collection is dropped
 * @param {string} url the url to the database from the .env details
 * @param {Array.<string>} collectionNames the name of the collection you want to connect
 * @throws {DatabaseError} when there is an error connecting to the mongo db.
 */
async function initialize(dbName,resetFlag,url,collectionNames){
    for(let i = 0; i < collectionNames.length;i++){
        try{
            logger.info("Attempting to connect to "+dbName);
            //store connected client for use while the app is running
            client = new MongoClient(url);
            await client.connect();
            logger.info("Connected to MongoDb");
            db = client.db(dbName);

            //Check to see if the users collection exists
            collectionCursor = await db.listCollections({name:collectionNames[i]});
            collectionArray = await collectionCursor.toArray();

            //if it exists and flag is set to true then drop the collection
            if(resetFlag && collectionArray.length>0)
                await db.collection(collectionNames[i]).drop();

            if(collectionArray.length==0 || resetFlag){
                //collation specifying case-insensitive collection
                const collation ={locale:"en",strength:1};
                //no match was found so create new collection
                await db.createCollection(collectionNames[i],{collation:collation});
            }
            //convenient access to collection
            if(collectionNames[i] === "users")
                usersCollection = db.collection(collectionNames[i]);
            else if(collectionNames[i] ==="products")
                productsCollection = db.collection(collectionNames[i]);
            else if (collectionNames[i] ==="orders")
                ordersCollection = db.collection(collectionNames[i]);

        }catch(err){
            logger.error(err.message);
            throw new DatabaseError("Error accessing MongoDB: "+err.message);
        }
    }
}


//#region CRUD Operations

//////////////////////////////////////////////////////// USERS CRUD //////////////////////////////////////////////////////////////////
/**
 * Adds a new user to the collection, if the passed parameters are valid and if a user with username and email don't already exist
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 * @throws {InvalidInputError} when username,email or password are invalid or if username/email is in use already
 * @throws {DatabaseError} if inserting into database fails
 */
async function addUser(username,email,password){
    let newUser;

    //validate each individually for more robust error handling.
    if(!await validateUtils.isValidUsername(username)){
        let responseMessage ="Username is invalid: "+username;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    if(!await validateUtils.isValidEmail(email)){
        let responseMessage ="Email is invalid: "+email;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    //Dont show password in error message for security.
    if(!await validateUtils.isValidPassword(password)){
        let responseMessage ="Password is invalid, enter a stronger password with at least 8 characters containing lowercase, uppercase, 1 number and 1 symbol";
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    //Check if user or email already exists in collection
    if(await isEmailInUse(email))
    {
        let responseMessage = "Email is already in use: "+email;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    if(await isUsernameInUse(username)){
        let responseMessage = "Username is already in use: "+username;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }
    //insert the new user into the collection
    const hashedPassword= await bcrypt.hash(password,saltRounds);
    newUser = {username:username,email:email,password:hashedPassword};
    try{
        //try to insert the user
        await usersCollection.insertOne(newUser);
    }catch(err){
        logger.error(err.message);
        throw new DatabaseError("Error inserting user into database: "+err.message);
    }
}

/**
 * returns the user object with the passed username if it exists
 * @param {String} username 
 * @returns returns user object, null if it doesn't exist in collection
 * @throws {DatabaseError} when getting user from database fails
 * @throws {InvalidInputError} when user was not found in database
 */
async function getSingleUser(username){
    let foundUser;
    try{
        //try to find user, incase of database error
        foundUser = await usersCollection.findOne({username:username});
    }catch(err){
        logger.error(err.message);
        throw new DatabaseError("Error getting user "+username+ "from database: "+err.message);
    }
    //if user doesn't exist in collection throw an exception
    if(foundUser==null){
        let responseMessage="User "+username+ " was not found in database";
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }
    return foundUser;

}

/**
 * calls collection.find() and returns an array of user objects.
 * @returns an array object containing the user objects in the collection
 * @throws {DatabaseError} when there is an error getting from the database
 */
async function getAllUsers(){
    let cursor;
    try{
        cursor = await usersCollection.find();
    }catch(err){
        logger.error(err.message);
        throw new DatabaseError("Error getting all users from database: "+err.message);
    }
    return await cursor.toArray();
}

/**
 * Deletes the user with the passed username from the collection. Throws if the user doesn't exist
 * @param {String} username 
 * @throws {InvalidInputError} when the user wasn't found in the database
 * @throws {DatabaseError} when there is an error deleting from the database
 */
async function deleteSingleUser(username){
    let deletedUser;

    try{
        //try to delete the user
        deletedUser = await usersCollection.deleteOne({username:username});
    }catch(err){
        logger.error(err.message);
        throw new DatabaseError("Error deleting user "+username+ "from database: "+err.message);
    }
    //Checks to see if the user was deleted
    if(deletedUser.deletedCount==0){
        let responseMessage = "User "+username+ " not found and wasn't deleted";
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);    
    }
}

/**
 * Updates the user with the passed username with the new details passed in the parameters. 
 * Throws an error if the user doesn't exist or if input is invalid
 * @param {String} username current username that you want to update
 * @param {String} newUsername 
 * @param {String} email new email
 * @param {String} password new password 
 * @throws {InvalidInputError} when the username/email/password are invalid or if username/email is in use or if username was not found
 * @throws {DatabaseError} if there was an error updating the database
 */
async function updateSingleUser(username,newUsername,email,password){
    let updatedUser;
    //validate users input
    
    if(!await validateUtils.isValidUsername(newUsername)){
        let responseMessage = "Cannot update user "+username+" Username is invalid: "+newUsername;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    if(!await validateUtils.isValidEmail(email)){
        let responseMessage = "Cannot update user "+username+" Email is invalid: "+email;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    //Don't show password in error message for security.
    if(!await validateUtils.isValidPassword(password)){
        let responseMessage = "Cannot update user "+username+" Password is invalid, enter a stronger password with at least 8 characters containing lowercase, uppercase, 1 number and 1 symbol";
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    if(await isEmailInUse(email))
    {
        let responseMessage = "Cannot update user "+username+" Email is already in use: "+email;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    if(await isUsernameInUse(newUsername)){
        let responseMessage = "Cannot update user "+username+" Username is already in use: "+newUsername;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);
    }

    //Update the user
    try{
        updatedUser = await usersCollection.updateOne({username:username},{$set:{username:newUsername,email:email,password:password}});
    }catch(err){
        logger.error(err.message);
        throw new DatabaseError("Error updating user "+username+" in database: "+err.message);
    }
    //Checks to see if the user was updated
    if(updatedUser.modifiedCount==0){
        let responseMessage = "User "+username+ " not found and wasn't updated with "+newUsername;
        logger.error(responseMessage);
        throw new InvalidInputError(responseMessage);    
    }

}


//////////////////////////////// ORDERS CRUD //////////////////////////////////
/**
 * adds a new order to the database
 * @param {Int32} orderId | id of the order that was placed
 * @param {Double} price | price of the order  
 * @returns the order object that will be added
 * @throws {InvalidInputError} When orderid and/or price are incorrectly formatted
 * @throws {DatabaseError} When you cannot access the database or 
 */
 async function addOrder(orderId, price)
 {
     try 
     {
         pass = await validateUtils.isValidOrder(orderId,price);
         // prevents adding duplicate order IDs
         const duplicateOrderId = await ordersCollection.findOne( {orderId: orderId});
         if( pass == true && !duplicateOrderId)
         {
             
             
 
             orderToAdd = { orderId: orderId , price: price};
             let result = await ordersCollection.insertOne(orderToAdd);
             if(!result)
             { 
                 logger.debug("The order was not added");
                 throw new InvalidInputError("could not add");
             }
            return orderToAdd;
         }    
         else
         {
             logger.debug("The order id entered was incorrect");
             throw new InvalidInputError();
         }
     }
      catch (error)
     {
         if(error instanceof InvalidInputError)
         {
             logger.warn("There was invlid input in adding this order");
             throw error
         }
         else{
             logger.error(error.message);
             throw new DatabaseError("could not add order to the database");
         }
         
     }
 }
 
 /**
  * function that gets one order from the database using the order's id
  * @param {Int32} orderId | id of the order to look for 
  * @returns the order object you are looking for
  * @throws {InvalidInputError} When orderid is incorrectly formatted or does not exist in the database
  * @throws {DatabaseError} when you cannot access the database
  */
 async function getOneOrder(orderId)
 {
    try 
    {
     // const db =  client.db(dbName);
     // ordersCollection = db.collection("orders");
     if (orderId < 0 )
     {
         logger.debug("Invalid order id entered " + orderId)
         throw new InvalidInputError("The order id you entered was not valid");
     }
     let result = await ordersCollection.findOne({ orderId: orderId });
     
 
     if(!result)
     {
         logger.debug("Order does not exist in database");
         throw new InvalidInputError("could not find the order you asked for in the database");
     }
 
     return result;
 
 
    }
     catch (error) 
     {
         if(error instanceof InvalidInputError)
         {
             logger.error(error.message);
             throw error;
         }
         else
         {
             logger.error(err.message);
             throw new DatabaseError;
         }
         
     }
 }
 
 /**
  * function that gets all of the orders in the database
  * @returns an array of all the orders
  * @throws {DatabaseError} When you cannot access the database
  */
 async function GetAllOrders()
 {
     
 
     try
     {
         allOrdersFound = await ordersCollection.find();
 
         if(!allOrdersFound)
         {
             logger.debug("Access to the database was impossible or it may not exist");
             throw new DatabaseError("could not access the database or it does not exist");
         }
 
         allOrdersArray = await allOrdersFound.toArray();
 
 
 
         return allOrdersArray;
     }
     catch(err)
     {
         if(err instanceof DatabaseError)
         {
             logger.error(err.message);
             throw err;
         }
        
     }
 
 }
 
 /**
  * function that finds one order and replaces it using the order id
  * @param {Integer} orderId | original id of the order
  * @param {Int32} newOrderId | the new order id
  * @param {Double} newPrice | the new price of the order
  * @returns the replaced order object
  * @throws {InvalidInputError} When orderid and/or price are incorrectly formatted
  * @throws {DatabaseError} When access to the database
  */
 async function replaceOrder(orderId,newOrderId,newPrice)
 {
     
     try 
     {
         pass = await validateUtils.isValidOrder(newOrderId,newPrice);
         
         if(ordersCollection.find({orderId: orderId}) == false)
         {
             logger.debug("The order id that is being looked for does not exist in the database");
             throw new InvalidInputError("The order Id you want to change from is not in the database");
         }
         else
         {
             if(pass)
             {
                const result = await ordersCollection.findOneAndReplace({ orderId: orderId}, {orderId: newOrderId, price: newPrice}, {returnDocument: "after"});
                 return result.value;
             }
             else
             {
                 logger.debug("The order could not be updated in the database");
                 throw new InvalidInputError("could not update order in database");
             } 
         }
     
     } 
     catch (error) 
     {
         if(error instanceof InvalidInputError)
         {
             logger.error(error.message);
             throw error;
         }
         else
         {
             logger.error(error.message);
             throw new DatabaseError(error.message);
         }
     }
     
 }
 
 /**
  * function that deletes a specific order depending on its id
  * @param {Int32} orderId | id of the order to delete
  * @returns the deleted order object
  * @throws {InvalidInputError} When the order id entered is formatted incorrectly
  */
 async function deleteOrder(orderId)
 {
    try {
     if(orderId > 0 && !null)
     {
         
         result = await ordersCollection.deleteOne({orderId: orderId});
         if(result)
         {
             return result;
 
         }
         else
         {
             logger.debug("order id does not exist in database");
             throw new InvalidInputError("The orderid you entered is inexistant");
         }
         
     }  
    else
    {
         throw new InvalidInputError("the order id you entered was invalid");
    }
    }
     catch (error) 
    {
     if(error instanceof InvalidInputError)
     {
         logger.error(error.message);
         throw error;
     }
     else
     {
         logger.error(error.message);
         throw new DatabaseError("could not delete order from the database");
     }
    }
 
 }

 //////////////////////////////////////////////////////////////// PRODUCTS CRUD //////////////////////////////////////////////////////////////////


 async function addProduct(flavour, type, price, description){
    let newProduct;   
    if(await validateUtils.isValidProduct(flavour,type,price)){
        newProduct = { flavour: flavour, type: type, price: price, description: description };
    }
    else{
        throw new InvalidInputError("Product values invalid");
    }

    try{
        await productsCollection.insertOne(newProduct);
        return newProduct;
    }catch(err){
        throw new DatabaseError("Can't insert product to database");
    }
}

async function getSingleProduct(flavour){
    try{
        if(!flavour){   
        throw new InvalidInputError("Error: No flavour specified");
    }
        let query = {flavour: flavour};
        let done = productsCollection.findOne(query);
        return done;
    }
    catch(error){
        throw new 
            DatabaseError("Error: Execution of findOne() resulted in an error");
    } 
}

async function getAllProducts(){
    try{
        const cursor = await productsCollection.find({});
        const allProduct = await cursor.toArray();
        return allProduct;
    }
    catch(err){
        if(err instanceof DatabaseError){
            throw new DatabaseError(err.message);
        }
        console.log(err.message);
    }
}
/**
 * Checks validity of an object with the updated price,
 * if valid, updates the product in the "products" collection
 * @param {object} update 
 * @param {price} updateValue 
 * @returns true if successfully updated the product
 * @returns false if update failed
 */
async function updateOneProduct(update, updateValue){
    try{
        let product;
        if(validateUtils.isValidProduct(update.flavour,update.type,updateValue.price)){
            product = await productsCollection.updateOne({flavour: update.flavour},
                {$set:{flavour: update.flavour, type: update.type, price: updateValue.price}});
        }
        if(product != undefined && product.modifiedCount > 0){
            return product;
        }
        return false;
    }
    catch(err){
        if(err instanceof DatabaseError){
            console.log("Error: Database error when executing update");
        }
    }
}
/**
 * Attempts to delete a product from the "products" collection according to the given flavour
 * @param {flavour} deleteProduct 
 * @returns false if delete failed
 * @returns true if successfully deleted the product
 * @error DatabaseError if there is an error deleting the product from the database
 * @error InvalidInputError if the input was invalid (null or undefined)
 */
 async function deleteOneProduct(deleteProduct){
    let test; 
    try{
        test = await productsCollection.deleteOne({flavour:deleteProduct});
        if(test.deletedCount==0){
            return false;
        }
        return product;
    }
    catch(err){
        console.log("Could not delete product: " + err.message);
        if(err instanceof DatabaseError){
            console.log("Could not access the database: " +err.message);
            throw new DatabaseError("Could not access the database: " +err.message);
        }
        if(err instanceof InvalidInputError){
            console.log("Invalid input: " +err.message);
            throw new InvalidInputError("Invalid input: " +err.message);
        }
        console.log("Unexpected error: " + err.message);
        throw new Error("Unexpected error: " + err.message);
    }
}

//#endregion CRUD Operations

/**
 * Returns the users collection
 * @returns the users collection if not null
 */
async function getUserCollection(){
    if(usersCollection!=null)
        return usersCollection;
}

/**
 * Returns the products collection
 * @returns the products collection if not null
 */
async function getProductsCollection(){
    if(productsCollection!=null)
        return productsCollection;
}

/**
 * Returns the orders collection
 * @returns the orders collection if not null
 */
async function getOrdersCollection(){
    if(ordersCollection!=null)
        return ordersCollection;
}


//#region Helper functions  

/**
 * Checks if the passed email is already in use
 * @param {String} email 
 * @returns true if email is already in use, false if it isn't
 */
async function isEmailInUse(email){
    let user = await usersCollection.findOne({email:email});

    if(user == null){
        return false;
    }
    return true;
    
}

/**
 * Checks if the passed username is already in use
 * @param {String} username 
 * @returns true if username is already in use, false if it isn't
 */
async function isUsernameInUse(username){
    let user = await usersCollection.findOne({username:username});
    if(user == null){
        return false;
    }
    return true;
}

/**
 * Closes the connection to the database
 */
async function close(){
    try{
        await client.close();
        logger.info("MongoDB connection closed");
    }catch(err){
        logger.error(err.message);
    }
}
//#endregion Helper functions

module.exports = {initialize,addUser,getOrdersCollection,getProductsCollection,getSingleUser,getAllUsers,close,getUserCollection,deleteSingleUser,updateSingleUser,addOrder, getOneOrder, GetAllOrders , replaceOrder, deleteOrder,addProduct, 
    getSingleProduct, getAllProducts, 
    updateOneProduct, deleteOneProduct};