import { Link, useLocation } from "react-router-dom";


function SystemError({errorMessage}){

    const {state} = useLocation();
    return(
        <div>
            <h1>Opps! looks like our under resourced systems are broken</h1>
            {errorMessage && <p>{errorMessage}</p>}
            {state && state.errorMessage && <p>{state.errorMessage}</p>}
            <Link to="/">Home</Link>
        </div>
    )
}

export default SystemError;