import {useState} from "react";
import {DisplayProduct} from "./DisplayProduct";
import { GetSingleProductForm } from "./SingleProductForm";

/**
 * A simple test component to give some example data.
 * @returns a button and display for button results.
 */
function SingleProduct() {
    const [product, setProduct] = useState({});

    return (
        <>
            <GetSingleProductForm setProduct={setProduct}/>
            <DisplayProduct product={product} heading="The found product is" />
        </>
    )
}

export { SingleProduct };