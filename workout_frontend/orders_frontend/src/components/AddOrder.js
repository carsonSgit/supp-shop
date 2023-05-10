import { useState } from "react";
import {AddOrderForm} from "./AddOrderForm";
import { DisplayOrder} from "./DisplayOrder";


function AddOrder(){
    const [added, setAdded] = useState({});

    return(
    <>
        <AddOrderForm setAdded={setAdded}/>
        <DisplayOrder order={added} heading="The added order is: "/>
    </>
    )
}

export { AddOrder }