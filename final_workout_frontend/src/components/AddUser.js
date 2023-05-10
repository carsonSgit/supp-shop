import{useState} from 'react';
import {AddUserForm} from "./AddUserForm";
import { DisplayUser } from './DisplayUser';


/* Component that lets the user get a user and then displays it to the screen */
function AddUser(){
    const [added,setAdded] = useState({}); //Empty object by default

    return(
        <>
            <AddUserForm setAdded={setAdded}/>
            <DisplayUser user ={added} heading="The added user is" />
        </>
    );
}
export {AddUser};