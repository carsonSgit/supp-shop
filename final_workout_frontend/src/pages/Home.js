import { useLocation, useSearchParams } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { useCookies } from "react-cookie";
function Home(){

    const [searchParams, setSearchParams] = useSearchParams();
    const {state} = useLocation();
   
    return(
        <div>
            <h1>Welcome to NAC Supplements</h1>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <h2>Hello {searchParams.get("name")}</h2>
        </div>
    );
}

export default Home