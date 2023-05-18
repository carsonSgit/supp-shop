import ErrorBoundary from "../components/ErrorBoundary";
import { SingleProduct } from "../components/SingleProduct";


function GetProduct() {
  


    return( <div>
        <h2>type in the product you want to look for</h2>
       
           <ErrorBoundary>
            <SingleProduct/>
            </ErrorBoundary> 
            
    </div>);
}

export default GetProduct;