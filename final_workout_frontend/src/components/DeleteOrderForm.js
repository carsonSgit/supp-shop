import { useState } from "react";


function DeleteOrderForm(props)
{
    const [OrderID, setId]= useState(null);
    




    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },

        };

        const response = await fetch("http://localhost:1333/orders/" + OrderID, requestOptions);
        const result = await response.json();
        props.setUpdated(result);
        
    }


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="oldOrderID">Current Order Id</label>
            <input type="text" placeholder="Current Order Id" onChange={(e) => setId(e.target.value)}/>  
            {OrderID  && <button type="submit">Delete Order</button>}        
        </form>
    );



}



export { DeleteOrderForm };