require('dotenv').config();
const url = process.env.URL_PRE + process.env.MONGODB_PWD + process.env.URL_POST
const app = require('./app.js')
const port = 1333;


const model = require("./models/ordersModelMongoDB");
var dbName = "orders_db";

model.initialize(dbName,false,url)
.then(
    app.listen(port)
);

/**
 * function to handle the http request to add a new order to the database
 * 
 * @param {int32} orderId | id of the order you want to add to the database
 * @param {*} price | price of the order you want to add to the database
 * @returns a message to the screen confirming the success or the failiure to add order to the database
 */
async function handleAddOrder(orderId, price)
{
    try
    {
        newEntry = await model.addOrder(orderId,price);
        if(newEntry == false)
        {
            return "\nA new entry could not be added: " + orderId + " " + price;

        }
        else
        {
            return "\nA new entry has been added: " + newEntry.orderId + " " +  newEntry.price;

        }
    }
    catch(error)
    {
        return "Entry with orderId: " + orderId + " could not be added";
    }
}


/**
 * function to handle the http request to find a single order by its id
 * @param {int32} orderId | id of the order to look for
 * @returns a message to the screen confirming the success or the failure to find order in the database
 */
async function handleFind(orderId){
   try 
   {
        foundOrder = await model.getOneOrder(orderId);
        if( foundOrder )
        {
            return "\norder found: " + orderId;
        }
        else
        {
            throw DatabaseError("\nCould not find order with orderId: " + orderId);
        }
   }
   catch(error)
   {
        if(error instanceof DatabaseError)
        {
            throw error
        }
        else
        {
            console.log(error.message);
            throw new DatabaseError("Order id was not found")
        }   
   }
}

/**
 * function to handle the http request to replace an order in the database
 * @param {int32} originalOrderId | id of the order that will be changed
 * @param {int32} newOrderId | new id of the order
 * @param {Double} newPrice | price that will replace the old one
 * @returns a message to the screen confirming the success or the failure to replace order in the database
 */
async function handleReplace(originalOrderId,newOrderId,newPrice)
{
    
  try 
  {
    replaced = await model.replaceOrder(originalOrderId,newOrderId,newPrice);
    if(replaced == false)
    {        
        return"\nCould not replace the original order, this was your attempt: " + newOrderId + " " + newPrice;
    }
    else
    {
        throw new DatabaseError("\nSuccessfully replaced: " + originalOrderId + " with " + newOrderId + " " + newPrice)
    }
  } 
  catch (err) 
  {
    if(err instanceof DatabaseError){
        throw err;
    }
    else if(err instanceof InvalidInputError){
        console.log("invalid input" + err.message);
        throw err;
    }
  }
}

/**
 * function that handles the http request to find all of the items in the database
 * @returns A table of all of the orders
 */
async function handleFindAll()
{
    try
    {
        orderContents = await model.GetAllOrders();
        printableOrderSheet = JSON.stringify(orderContents);
        console.table(orderContents);
                
        return "\n" + printableOrderSheet;
    }
    catch(err)
    {
        throw new DatabaseError(err.message);
    }
}

/**
 * function that handles the http request to delete an order
 * @param {int32} orderId | id of the order you are looking to delete
 * @returns 
 */
async function handleDelete(orderId){
    try
    {
        orderToDelete = await model.deleteOrder(orderId);
        if(orderToDelete == false)
        {
            return "\nOrderId was not found: " + orderId
        }
        else
        {
            throw new DatabaseError("\nYou deleted order: " + orderToDelete.toString() + " with order id: " + orderId);
        }
    }
    catch(err)
    {
        if(err instanceof DatabaseError)
        {
            throw err;
        }
    }
}


