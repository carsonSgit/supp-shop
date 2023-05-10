import {useState} from "react";
import {DisplayUser} from "./DisplayUser";
import { SingleUserForm} from "./SingleUserForm";

/** Component that lets the website user get a user and then display it */
function SingleUser(){
    const [user,setUser]=useState({}); // Empty object by default

    return(
        <>
            <SingleUserForm setUser={setUser}/>
            <DisplayUser user={user} heading="The found user is"/>
        </>
    );
}

export {SingleUser};