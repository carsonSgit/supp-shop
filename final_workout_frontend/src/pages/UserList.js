import { useLocation } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { AllUsers } from "../components/AllUsers";

function UserList(){
    const {state} = useLocation();
    return(
        <>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <AllUsers />
        </>
    );
}

export default UserList;