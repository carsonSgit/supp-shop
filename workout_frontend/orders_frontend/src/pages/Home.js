import Main from "../components/Main";
import { useLocation, useSearchParams } from "react-router-dom";
import { Alert } from "react-bootstrap/Alert";
function Home(){

    const [searchParams, setSearchParams] = useSearchParams();
    const {state} = useLocation();

    return(
        <div>
            <h1>welcome to Home</h1>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <h2>Hello {searchParams.get("name")}</h2>
            <Main />
        </div>
    );
}

export default Home