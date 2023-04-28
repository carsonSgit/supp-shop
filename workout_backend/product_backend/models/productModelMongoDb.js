const { MongoClient, MongoUnexpectedServerResponseError } = require("mongodb");
const { InvalidInputError } = require("./InvalidInputError");
const { DatabaseError } = require("./DatabaseError");
const validateUtils = require("./validateUtils");

/**
 * Creating global variables so that we can work with the database
 * everywhere in this .js file.
 */
let client;
let productsCollection;

async function initialize(url, dbName, resetFlag){
    try{
        //const url = process.env.URL_PRE + process.env.MONGODB_PWD + process.env.URL_POST;
        client = new MongoClient(url);
        await client.connect();

        console.log("Connected to MongoDb");

        const db = client.db(dbName);

        collectionCursor = await db.listCollections({name: "products"});
        collectionArray = await collectionCursor.toArray();
        if(collectionArray.length == 0){
            const collation = {locale:"en",strength:1};
            await db.createCollection("products", {collation: collation});
        }
        productsCollection = db.collection("products");

        if(resetFlag){
            await productsCollection.drop();
        }
    }catch(err){
        console.log(err.message);
        throw new DatabaseError(err.message);
    }
}

async function addProduct(flavour, type, price){
    let newProduct;   
    if(await validateUtils.isValid2(flavour,type,price)){
        newProduct = { flavour: flavour, type: type, price: price};
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
            MongoUnexpectedServerResponseError("Error: Execution of findOne() resulted in an error");
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
        if(validateUtils.isValid2(update.flavour,update.type,updateValue.price)){
            product = await productsCollection.replaceOne({flavour: update.flavour},
                {flavour: update.flavour, type: update.type, price: updateValue.price});
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
        return true;
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
async function close(){
    try{
        await client.close();
        console.log("MongoDB connection closed");
    }
    catch(err){
        console.log(err.message);
    }
}
async function getCollection(){
    return productsCollection;
}
module.exports = 
{   initialize, addProduct, 
    getSingleProduct, getAllProducts, 
    updateOneProduct, deleteOneProduct,
    close, getCollection
};