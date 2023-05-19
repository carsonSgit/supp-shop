import { LoginForm } from "./LoginForm";
import { DisplayUser } from "./DisplayUser";
import { useState } from "react";
function Login(){
    const [added,setAdded] = useState({});

    return(
        <>

            <LoginForm setAdded={setAdded}/>
            <DisplayUser user ={added} heading="Login here please" />
        </>
    )
}
export {Login}