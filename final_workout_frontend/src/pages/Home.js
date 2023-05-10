import { useLocation, useSearchParams } from "react-router-dom";
import Alert  from "react-bootstrap/Alert";
import { useCookies } from "react-cookie";
function Home(){

    const [searchParams, setSearchParams] = useSearchParams();
    const {state} = useLocation();
    const [cookies,setCookie] = useCookies(["lang"]);
    return(
        <div lang={cookies.lang}>
            <h1>welcome to Home</h1>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <h2>Hello {searchParams.get("name")}</h2>
        </div>
    );
}

export default Home