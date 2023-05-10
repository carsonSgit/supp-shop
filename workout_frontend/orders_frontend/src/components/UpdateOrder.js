import { useState } from "react";
import { UpdateOrderForm } from "./UpdateOrderForm";
import { DisplayOrder } from "./DisplayOrder";


function UpdateOrder(){
    const [updated, setUpdated] = useState({});

    return(
        <>
            <UpdateOrderForm setUpdated={setUpdated}/>
            <DisplayOrder order={updated} heading="The updated order is"/>
        </>
    )
}

export { UpdateOrder };