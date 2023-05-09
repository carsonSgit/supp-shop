import { useState } from "react";
import {useNavigate} from "react-router-dom";


/**
 * Component that lets the user enter in the old and new username and email and password
 * of a user and then calls the backend to change it.
 * 
 * @props {function} setUpdated: To pass back the changed user by side-effect 
 * @returns  JSX containing the form.
 */
function UpdateUserForm(props){
    const [oldUsername , setOldUsername] = useState(null);
    const [newUsername , setNewUsername] = useState(null);
    const [email,setEmail ] = useState(null);
    const [password, setPassword] = useState(null);

    const navigate = useNavigate();


    /** Handler method that makes the fetch request based on the form values. */
    const handleSubmit = async (event) => {
        event.preventDefault();

        /** Options that indicate a post request passing in JSON body */
        const requestOptions = {
            method: "PUT",
            body: JSON.stringify({
                username:newUsername,
                email:email,
                password:password,
            }),
            headers:{
                "Content-Type": "application/json; charset=UTF-8",
            },
        };
        const response = await fetch(`http://localhost:1339/users/${oldUsername}`,requestOptions);
        const result = await response.json();
        if(response.status === 400 || response.status ===500)
            navigate("/",{state:{errorMessage: result.errorMessage}});
        else
        props.setUpdated(result);
    };

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="oldUsername">Current username</label>
            <input type="text" placeholder="Current Username..." onChange={(e) => setOldUsername(e.target.value)}  />
            
            <label htmlFor="newUsername">New username</label>
            <input type="text" placeholder="New Username..." onChange={(e) => setNewUsername(e.target.value)}  />
    
            <label htmlFor="email">New Email</label>
            <input  type="text" placeholder="New Email..." onChange={(e) => setEmail(e.target.value)} />
    
            <label htmlFor="password">New Password</label>
            <input  type="password" placeholder="New Password..." onChange={(e) => setPassword(e.target.value)} />
    
            {oldUsername && newUsername && email && password && <button type="submit">Update User</button>}
        </form>
        );
}

export {UpdateUserForm};