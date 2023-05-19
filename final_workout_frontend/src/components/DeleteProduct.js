import { useState } from "react";
import { DeleteProductForm } from "./DeleteProductForm";
import { DisplayProduct } from "./DisplayProduct";


function DeleteProduct(){
    const [deleted, setDeleted] = useState({});

    return(
    <>
        <DeleteProductForm setDeleted={setDeleted}/>
        <DisplayProduct product={deleted} heading="The deleted product is: "/>
    </>
    )
}

export { DeleteProduct }