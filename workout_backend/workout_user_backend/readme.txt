npm i mongodb dotenv jest validator mongodb-memory-server unique-username-generator express express-list-endpoints supertest pino pino-http


MONGODB_PWD = "cWQvCh6D15Gl94wh"

URL_PRE = "mongodb+srv://mongouser:"

URL_POST = "@cluster0.wjcfpsx.mongodb.net/?retryWrites=true&w=majority"


ENDPOINTS:

GET home: /
GET getOneUser: /users/:username  (Try Greg)
GET listAllUsers: /users/all

PUT updateUser: /users/:username (:username is the old username Try Greg and update with json body, should contain the new username,email and password ex.
{"username": "Bobby13", "email": "newBobby13@gmail.com","password": "jfdgoewnfRQUBRQIN12!!"} )

POST createUser: /users (JSON body should contain username, email, password ex: 
{"username":"Frank12", "email":"FrankG12@gmail.com", "password": "nafayeqoFlaE!12@"} )

DELETE deleteUser: /users/:username (Try Frank12 after POST)

error: *

