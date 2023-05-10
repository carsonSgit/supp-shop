import { useState } from "react";
import { DeleteOrderForm } from "./DeleteOrderForm";
import { DisplayOrder} from "./DisplayOrder";


function DeleteOrder(){
    const [added, setAdded] = useState({});

    return(
    <>
        <DeleteOrderForm setAdded={setAdded}/>
        <DisplayOrder order={added} heading="The deleted order is: "/>
    </>
    )
}

export { DeleteOrder }