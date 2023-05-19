import ErrorBoundary from "../components/ErrorBoundary";
import { UpdateProduct } from "../components/UpdateProduct";

function UpdateProducts(){

    return(

        <div>
            <ErrorBoundary fallback={<h1>Something went wrong updating the product</h1>}>
                <UpdateProduct/>
            </ErrorBoundary>
        </div>
    )

}

export default UpdateProducts;