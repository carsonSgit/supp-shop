import ErrorBoundary from "../components/ErrorBoundary";
import { SingleOrder } from "../components/SingleOrder";


function GetOne() {
  


    return( <div>
        <h1>Type in the order you want to look for</h1>
       
           <ErrorBoundary>
            <SingleOrder/>
            </ErrorBoundary> 
            
    </div>);
}

export default GetOne;