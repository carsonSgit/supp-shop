import { useState } from "react";
import {UpdateUserForm} from "./UpdateUserForm";
import { DisplayUser } from "./DisplayUser";

/** Component that lets the user update a user and then displays it to the screen. */
function UpdateUser(){
    const [updated,setUpdated] = useState({}); //Empty object by default

    return(
        <>
        <UpdateUserForm setUpdated={setUpdated} />
        <DisplayUser user = {updated} heading="The changed user is"/>
        </>
    );
}

export {UpdateUser};