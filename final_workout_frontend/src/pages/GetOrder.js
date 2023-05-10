import ErrorBoundary from "../components/ErrorBoundary";
import { SingleOrder } from "../components/SingleOrder";


function GetOne() {
  


    return( <div>
        <h2>type in the order you want to look for</h2>
       
           <ErrorBoundary>
            <SingleOrder/>
            </ErrorBoundary> 
            
    </div>);
}

export default GetOne;