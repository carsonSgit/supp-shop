import { useState } from "react";
import { DeleteProductForm } from "./DeleteProductForm";
import { DisplaySuccess } from "./DisplaySuccess";


function DeleteProduct(){
    const [deleted, setDeleted] = useState({});

    return(
    <>
        <DeleteProductForm setDeleted={setDeleted}/>
        <DisplaySuccess product={deleted} heading="Delete"/>
    </>
    )
}

export { DeleteProduct }