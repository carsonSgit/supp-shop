const express = require('express');
const cookieParser = require('cookie-parser');  
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const pinohttp = require('pino-http');
const logger = require('./logger');
const httpLogger = pinohttp({
        logger: logger
    });
    
app.use(httpLogger);

const controllers = ['homeController','ordersController', 'errorController']
const corsOptions = {
    origin: "http://localhost:300",
    credentials: true,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Accept, Content-Type, Authorization"); 
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Access-Control-Allow-Credentials", true);
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH");
      next();
    });
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//registering route from all controllers
// assumes a flat directory structure and common 'routeRoot' / 'router' export


controllers.forEach((controllerName) => {
    try{
        const controllerRoutes = require('./controllers/' + controllerName);
        app.use(controllerRoutes.routeRoot,controllerRoutes.router);

    }
    catch(error){
        logger.info(error);
        throw error;
    }
})

const listEndpoints = require('express-list-endpoints');
console.log(listEndpoints(app));

module.exports = app;