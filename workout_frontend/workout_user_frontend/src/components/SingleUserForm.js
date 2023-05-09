import { useState } from "react";
import {useNavigate} from "react-router-dom";

/**
 * Component that lets the user enter in the old and new username and email and password
 * of a user and then calls the backend to change it.
 * 
 * @props {function} setUpdated: To pass back the changed user by side-effect 
 * @returns  JSX containing the form.
 */
function SingleUserForm(props){
    const [username , setUsername] = useState(null);

    const navigate = useNavigate();
    /** Handler method that makes the fetch request based on the form values. */
    const handleSubmit = async (event) => {
        event.preventDefault();

        /** Options that indicate a post request passing in JSON body */
        const requestOptions = {
            method: "GET",
            headers:{
                "Content-Type": "application/json; charset=UTF-8",
            },
        };
        const response = await fetch(`http://localhost:1339/users/${username}`,requestOptions);
        const result = await response.json();
        if(response.status === 400 || response.status ===500)
            navigate("/",{state:{errorMessage: result.errorMessage}});
        else
        props.setUser(result);
    };

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Username..." onChange={(e) => setUsername(e.target.value)}  />
           
            {username && <button type="submit">Find User</button>}
        </form>
        );
}

export {SingleUserForm};