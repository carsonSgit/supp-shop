import { Link, useLocation} from "react-router-dom";

function UserError(){
    

    return(
        <div>
            <h1>There was an Input error</h1>
            <p> {state.errorMessage}</p>
            <Link to="/">Home</Link>
        </div>
    )
}


export default UserError