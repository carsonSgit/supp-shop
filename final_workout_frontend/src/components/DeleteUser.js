import{useState} from 'react';
import {DeleteUserForm} from "./DeleteUserForm";
import { DisplayUser } from './DisplayUser';


/* Component that lets the user delete a user and then displays it to the screen */
function DeleteUser(){
    const [deleted,setDeleted] = useState({}); //Empty object by default

    return(
        <>
            <DeleteUserForm setDeleted={setDeleted}/>
            <DisplayUser user ={deleted} heading="The deleted user is" />
        </>
    );
}
export {DeleteUser};