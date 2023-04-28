const express = require('express');
const app = express();
const logger = require('./logger');
const pinohttp = require('pino-http');
const httpLogger = pinohttp({
    logger: logger
});
app.use(httpLogger);
const listEndpoints = require('express-list-endpoints');
const bodyParser = require('body-parser');
const cors = require("cors");


//make sure errorController is last or else it will catch all requests
const controllers = ['homeController','userController','errorController']

app.use(cors());
app.use(express.json());
//Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Register routes from all controllers
//(Assumes a flat directory structure and common 
// 'routeRoot' / 'router' export)
controllers.forEach((controllerName)=>{
    try{
        //requires the current controllerName file and uses it's const variables routeRoot and router in app.use calls
        const controllerRoutes = require('./controllers/'+controllerName);
        app.use(controllerRoutes.routeRoot,controllerRoutes.router);

    }catch(error){
        //We could fail gracefully, but this would hide bugs later on.
        logger.error(`Error loading controller: ${controllerName}`);
        logger.error(error);
        throw error;
    
    }
})

console.log(listEndpoints(app));
module.exports = app;
