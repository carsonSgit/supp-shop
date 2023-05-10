import {useState} from "react";
import {useNavigate} from "react-router-dom";
/**
 * Component that lets the user enter in the name, email and password of a new user
 * and then calls the backend to add it.
 * Side effect: passes the added user using setAdded
 * @returns JSX containing the form.
 */
function AddUserForm(props){
    const [username, setUsername] =useState(null);
    const [email,setEmail ] = useState(null);
    const [password,setPassword] = useState(null);

    const navigate = useNavigate();

    /** Handler method that makes the fetch request based on the form values */
    const handleSubmit = async (event) => {
        event.preventDefault();

        /** Options that indicate a post request passed in JSON body */
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
            headers:{
                "Content-Type": "application/json; charset=UTF-8",
            },
        };
    const response = await fetch("http://localhost:1339/users",requestOptions);
    const result = await response.json();
    if(response.status === 400 || response.status ===500)
        navigate("/",{state:{errorMessage: result.errorMessage}});
    else
        props.setAdded(result);
};

    return(
    <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username..." onChange={(e) => setUsername(e.target.value)}  />

        <label htmlFor="email">Email</label>
        <input  type="text" placeholder="Email..." onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input  type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)} />

        {username && email && password && <button type="submit">Add User</button>}
    </form>
    );
}
export {AddUserForm};