import Main from "../components/Main";
import {useLocation, useSearchParams} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';

function Home(){
    const [searchParams,setSearchParams] =useSearchParams();
    const {state} = useLocation();
    return(
        <>
            {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
            <p>Welcome to our fitness website {searchParams.get("username")}</p>
            <Main />
        </>
    );
}

export default Home;