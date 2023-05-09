import {useLocation} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { DeleteUser } from "components/DeleteUser";

function UserDelete(){
    const {state} = useLocation();
    return(
        <>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <DeleteUser />
        </>
    );
}

export default UserDelete;