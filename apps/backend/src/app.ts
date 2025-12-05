import express, { Express, Router } from "express";
const app: Express = express();
import cookies from "cookie-parser";
import logger from "./logger";
import pinohttp from "pino-http";
const httpLogger = pinohttp({
	logger: logger,
});
app.use(httpLogger);
app.use(cookies());
import listEndpoints from "express-list-endpoints";
import bodyParser from "body-parser";
import cors from "cors";

// Debug middleware to log all requests
app.use((req, _res, next) => {
	logger.info(`Incoming ${req.method} request to ${req.path}`);
	next();
});

//make sure errorController is last or else it will catch all requests
const controllers: string[] = [
	"homeController",
	"userController",
	"productController",
	"ordersController",
	"sessionController",
	"errorController",
];

app.use(
	cors({
		origin: true, // Allow all origins (or specify 'http://localhost:3000')
		credentials: true,
	}),
);
app.use(express.json());
//Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Register routes from all controllers
//(Assumes a flat directory structure and common
// 'routeRoot' / 'router' export)
import * as homeController from "./controllers/homeController";
import * as userController from "./controllers/userController";
import * as productController from "./controllers/productController";
import * as ordersController from "./controllers/ordersController";
import * as sessionController from "./controllers/sessionController";
import * as errorController from "./controllers/errorController";

const controllerRoutes: Record<string, { routeRoot: string; router: Router }> = {
	homeController,
	userController,
	productController,
	ordersController,
	sessionController,
	errorController,
};

controllers.forEach((controllerName) => {
	try {
		const controller = controllerRoutes[controllerName];
		if (!controller) {
			throw new Error(`Controller ${controllerName} not found`);
		}
		app.use(controller.routeRoot, controller.router);
	} catch (error) {
		//We could fail gracefully, but this would hide bugs later on.
		logger.error(`Error loading controller: ${controllerName}`);
		logger.error(error);
		throw error;
	}
});

console.log(listEndpoints(app));
export default app;

