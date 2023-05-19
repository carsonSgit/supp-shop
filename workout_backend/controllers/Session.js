const uuid=require('uuid');

//This object stores the user sessions
const sessions=[];

function createSession(username,numMinutes){
    //Generate a random UUID as the sessionId
    const sessionId=uuid.v4();

    //set the expiry time as numMinutes after the current time
    const expiresAt=new Date(Date.now()+numMinutes*60000);

    //Create a session object containing information about the user and expiry time
    const thisSession = new Session(username,expiresAt);

    //Add the session information to the sessions map, using sessionId as the key
    sessions[sessionId]= thisSession;

    return sessionId;
}

function getSession(sessionId){
    return sessions[sessionId];
}

function deleteSession(sessionId){
    delete sessions[sessionId];
}
//Each session contains the username of the user and the item at which it expires
//This object can be extended to store additional protected session information
class Session{
    constructor(username,ExpiresAt){
        this.username=username;
        this.ExpiresAt=ExpiresAt;
    }

    isExpired(){
        this.ExpiresAt<(new Date())
    }
}

module.exports = {Session,createSession,getSession, deleteSession}