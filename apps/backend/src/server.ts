//#region Assignment 2
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import app from "./app";
const port = 1339;

//Variables used for initialize call
import * as model from "./models/workoutMongoDb";
import { InvalidInputError } from "./models/InvalidInputError";
import { DatabaseError } from "./models/DatabaseError";

const url =
	(process.env.URL_PRE as string) +
	(process.env.MONGODB_PWD as string) +
	(process.env.URL_POST as string);

// Validate that environment variables are loaded
if (!process.env.URL_PRE || !process.env.MONGODB_PWD || !process.env.URL_POST) {
	console.error("Error: Missing required environment variables. Please check your .env file.");
	process.exit(1);
}

const collectionNames: string[] = ["users", "products", "orders"];
model
	.initialize("workout_db", false, url, collectionNames)
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	})
	.catch((error: Error) => {
		console.error("Failed to initialize database:", error);
		process.exit(1);
	});

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
 * @param username
 * @param email
 * @param password
 * @returns String with result of adding user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _handleAddUser(
	username: string,
	email: string,
	password: string,
): Promise<string> {
	try {
		//add the user and return successful string if exception wasn't thrown
		await model.addUser(username, email, password);
		return "User " + username + " added successfully";
	} catch (err) {
		//Check type of error for robustness
		if (err instanceof InvalidInputError) {
			console.log("Invalid Input: " + err.message);
			return "Invalid Input: " + err.message;
		}

		if (err instanceof DatabaseError) {
			console.log("Database Error: " + err.message);
		} else {
			const error = err as Error;
			console.log("Unexpected Error: " + error.message);
		}

		return "Error adding user: " + username;
	}
}

/**
 * Deletes user from collection and returns a string with the result, whether it was successful or not.
 * @param username
 * @returns String with result of deleting user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _handleGetUser(username: string): Promise<string> {
	try {
		//try getting the user, return whether it was found or not. If no exception was thrown
		const user = await model.getSingleUser(username);
		return "User " + username + " found with email: " + user.email;
	} catch (err) {
		//check type of error for robustness
		if (err instanceof InvalidInputError) {
			console.log("Invalid Input: " + err.message);
			return "Invalid Input: " + err.message;
		}

		if (err instanceof DatabaseError) {
			console.log("Database Error: " + err.message);
		} else {
			const error = err as Error;
			console.log("Unexpected Error: " + error.message);
		}

		return "Error getting user: " + username;
	}
}

/**
 * Gets all users in collection and returns a string with the result, whether it was successful or not.
 * @returns String with all users in collection
 */
// Legacy function, kept for reference
async function _handleGetAllUsers(): Promise<string> {
	let userArray: import("./types/models.types").User[] = [];
	try {
		//get the array of users from collection and log a table to console
		userArray = await model.getAllUsers();
		console.table(userArray);
	} catch (err) {
		console.log(err);
		userArray = [];
	}

	//Return a string with all the users appended
	let listOfUsers = "";
	for (let i = 0; i < userArray.length; i++) {
		listOfUsers +=
			i +
			1 +
			". User found: " +
			userArray[i].username +
			" with email " +
			userArray[i].email +
			"\n";
	}
	//incase the collection is empty
	if (listOfUsers == "") {
		listOfUsers = "No users in collection\n";
	}
	return listOfUsers;
}

/**
 * Deletes user from collection and returns a string with the result, whether it was successful or not.
 * @param username
 * @returns String with result of deleting user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _handleDeleteSingleUser(username: string): Promise<string> {
	try {
		//try deleting the user from collection with the passed username
		await model.deleteSingleUser(username);
		return "User " + username + " deleted successfully";
	} catch (err) {
		//check type of error for robustness
		if (err instanceof InvalidInputError) {
			console.log("Invalid Input: " + err.message);
			return "Invalid Input: " + err.message;
		}

		if (err instanceof DatabaseError) {
			console.log("Database Error: " + err.message);
		} else {
			const error = err as Error;
			console.log("Unexpected Error: " + error.message);
		}

		return "Error deleting user: " + username;
	}
}

/**
 * Updates user in collection and returns a string with the result, whether it was successful or not.
 * @param username
 * @param newUser
 * @returns String with result of updating user
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _handleUpdateUser(
	username: string,
	newUser: { username: string; email: string; password: string },
): Promise<string> {
	try {
		//try to update specified username in collection with the new user object passed.
		await model.updateSingleUser(
			username,
			newUser.username,
			newUser.email,
			newUser.password,
		);
		return (
			"User " + username + " updated successfully to " + newUser.username
		);
	} catch (err) {
		//check type of error for robustness
		if (err instanceof InvalidInputError) {
			console.log("Invalid Input: " + err.message);
			return "Invalid Input: " + err.message;
		}

		if (err instanceof DatabaseError) {
			console.log("Database Error: " + err.message);
		} else {
			const error = err as Error;
			console.log("Unexpected Error: " + error.message);
		}

		return "Error updating user: " + username;
	}
}
//#endregion

