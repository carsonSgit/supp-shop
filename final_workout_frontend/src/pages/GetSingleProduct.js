import ErrorBoundary from "../components/ErrorBoundary";
import { SingleProduct } from "../components/SingleProduct";

function GetProduct() {
  


    return( 
    <div>
        <h1>Type in the product you want to look for</h1>
            <ErrorBoundary>
                <SingleProduct/>
            </ErrorBoundary>    
    </div>
    );
}

export default GetProduct;