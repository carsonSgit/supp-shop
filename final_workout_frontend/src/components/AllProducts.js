import { useState } from "react";
import { ListProducts } from "./ListProducts";

/**
 * Simple component that utilizes a button that when clicked calls a
 *  GET request on all products.
 * @returns a button that will display all products.
 */
function AllProducts() {
    const [products, setProducts] = useState([]); // default empty state

    const callGetAllProducts = async () => {
        const response = await fetch("http://localhost:1339/products/all", {method: "GET"});
        const result = await response.json();
        setProducts(result);
    };

    return (
        <>
            <ListProducts products={products} />
            <button onClick={callGetAllProducts}>Get All Products</button>
        </>
    )
}

export { AllProducts };