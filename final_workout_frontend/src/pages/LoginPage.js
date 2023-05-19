import { useLocation } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Login from "../components/Login";
function LoginPage(){
    const {state} = useLocation();
    return(
        <>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <Login/>
        </>
    );
}

export default LoginPage;