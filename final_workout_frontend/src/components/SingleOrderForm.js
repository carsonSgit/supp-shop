import { useState } from "react";


function GetSingleOrderForm(props)
{
    const [OrderID, setId]= useState(null);
    




    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include"
        };

        const response = await fetch("http://localhost:1333/orders/" + OrderID, requestOptions);
        const result = await response.json();
        props.setAdded(result);
        
    }


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="oldOrderID"> Order Id</label>
            <input type="text" placeholder=" Order Id" onChange={(e) => setId(e.target.value)}/>  
            {OrderID  && <button type="submit">Get Order</button>}        
        </form>
    );



}



export { GetSingleOrderForm };