import { useLocation } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { DeleteProduct } from "../components/DeleteProduct";

function DeleteProducts(){
    const {state} = useLocation();
    return(
        <>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <DeleteProduct />
        </>
    );
}

export default DeleteProducts;