import { useState } from "react";
import { ListUsers } from "./ListUsers";

/**
 * Component that lets the user get all the users and then displays them as a list.
 * @returns 
 */
function AllUsers(){
    const [users,setUsers] = useState([]); //Empty array by default

    /** Handler function to fetch all users and update the state value */
    const callGetAllUsers= async() =>{
        const response =await fetch("http://localhost:1339/users/all",{method: "GET"});
        const result = await response.json();
        setUsers(result);
    };
    
    return(
        <>
            <ListUsers users={users}/>
            <button onClick={callGetAllUsers}>Get All Users</button>
        </>
    );
}
export {AllUsers};