const express = require("express");
const {Session,createSession, getSession,deleteSession} = require("./Session");
const router = express.Router();
const routeRoot="/session";

router.get("/login",loginUser);

/** Log a user in and create a session cookie that will expire in 2 minutes */
function loginUser(request,response){
    //let's assume successful login for now
    const username="Joe";

    //Create a session object that will expire in 2 minutes
    const sessionId= createSession(username,2);

    //Save cookie that will expire.
    response.cookie("sessionId",sessionId,{expires:getSession(sessionId).expiresAt,httpOnly: true});
    response.redirect("/");
}

function authenticateUser(request){
    //If this request doesn't have any cookies, that means it isn't authenticated. Return null.
    if(!request.cookies){
        return null;
    }

    //We can obtain the session token from the requests cookies, which come with every request
    const sessionId=request.cookies['sessionId'];
    if(!sessionId){
        //If the cookie is not set, return null
        return null;
    }
    //We then get the session of the user from our session map
    userSession=getSession(sessionId);
    if(!userSession){
        return null;
    }
    //If the session has expired, delete the session from our map and return null
    if(userSession.isExpired()){
        deleteSession(sessionId);
        return null;
    }

    return {sessionId,userSession}; //Successfully validated
}

module.exports={router,routeRoot,loginUser,authenticateUser}