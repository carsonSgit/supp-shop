import {Link} from "react-router-dom";

function SystemError({errorMessage}){
    return(
        <div>
            <h1>Oops! There was a system error</h1>
            <p>{errorMessage}</p>
            <Link to="/">Home</Link>
        </div>
    );
}

export default SystemError;