const express = require('express');
const expressListRoutes = require('express-list-routes');
const app = express();
const pinohttp = require('pino-http');
const httpLogger = pinohttp();
const bodyParser = require('body-parser');
const cors = require('cors');

// Make sure errorController is last!
const controllers = ['homeController', 'productController', 'errorController'];

app.use(httpLogger);
app.use(cors());
app.use(express.json());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));

// Register routes from all controllers
// Assumes a flat directory structure and common
    // 'routeRoot' / 'router' export
controllers.forEach((controllerName) => {
    try{
        const controllerRoutes = require('./controllers/' + controllerName);

        app.use(controllerRoutes.routeRoot, controllerRoutes.router);
    }
    catch(error){
        console.log(error);
        throw error; 
    }
});

expressListRoutes(app, {prefix: '/'});
module.exports = app;