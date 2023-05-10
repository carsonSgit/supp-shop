import { useState } from "react";


function UpdateOrderForm(props)
{
    const [oldOrderID, setOldId]= useState(null);
    const [newPrice, setNewPrice] = useState(null);




    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "PUT",
            body: JSON.stringify({
                oldOrderId: oldOrderID,
                newPrice: newPrice,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },

        };

        const response = await fetch("http://localhost:1339/orders/" + oldOrderID, requestOptions);
        const result = await response.json();
        props.setUpdated(result);
        
    }


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="oldOrderID">Current Order Id</label>
            <input type="text" placeholder="Current Order Id" onChange={(e) => setOldId(e.target.value)}/>  
            <label htmlFor="oldOrderID">New Price</label>
            <input type="text" placeholder="New Price" onChange={(e) => setNewPrice(e.target.value)}/>
            {oldOrderID && newPrice && <button type="submit">Update Order</button>}        
        </form>
    );



}



export { UpdateOrderForm };