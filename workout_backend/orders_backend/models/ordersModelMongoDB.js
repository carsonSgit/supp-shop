const { MongoClient, Collection, Double, Int32 } = require("mongodb");
const validateUtils = require("./validateUtils");
const { DatabaseError } = require("./DatabaseError");
const { InvalidInputError } = require("./InvalidInputError");

const logger = require('../logger');
  
let client;
let ordersCollection;



/**
 * function to create a client object
 * @param {dbName} represents the name of the database that you want to use 
 * @returns a client object that can be acted upon
 
async function db(dbName)
{
    const db = client.db(dbName);

    return db;
}
*/

/**
 * function that initializes the database
 * @param {string} dbName | name of the database to be used 
 * @param {boolean} resetFlag | flag to see if the database exist if it does delete it
 */
async function initialize(dbName, resetFlag, url) 
{
    try 
    {
       
        
        client = new MongoClient(url);
        await client.connect();
        logger.info("Connected to your database");
        const db =  client.db(dbName);
        

        collectionCursor = await db.listCollections({ name: "orders" });
        collectionArray = await collectionCursor.toArray();

        if(collectionArray.length > 0 && resetFlag == true)
            {
                await db.collection("orders").drop();
            }
        // checking if the collection exists
        if(collectionArray.length == 0 || resetFlag == true)
        {
        
            // creating the collection if it does not exist
            await db.createCollection("orders");
        }

        ordersCollection = db.collection("orders")

    } catch (error) 
    {
       logger.error(error);
    }
}

async function getCollection(dbName)
{
    const db =  client.db(dbName);
    return db.collection("orders");
}


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
        pass = await validateUtils.isValid2(orderId,price);
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
        pass = await validateUtils.isValid2(newOrderId,newPrice);
        
        if(ordersCollection.find({orderId: orderId}) == false)
        {
            logger.debug("The order id that is being looked for does not exist in the database");
            throw new InvalidInputError("The order Id you want to change from is not in the database");
        }
        else
        {
            if(pass)
            {
                return await ordersCollection.replaceOne({orderId: orderId }, {orderId: newOrderId, price: newPrice});
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

/**
 * function that closes the connection to the database
 */
async function close() {
    try {
        await client.close();
        logger.info("MongoDB connection closed");
    } catch (error) {
        logger.error(err.message);
    }
}


module.exports = { initialize, addOrder, getOneOrder, GetAllOrders, close , replaceOrder, deleteOrder,getCollection };