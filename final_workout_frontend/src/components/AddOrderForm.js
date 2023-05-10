import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddOrderForm(props){

    const [OrderID, setOldId]= useState(null);
    const [Price, setNewPrice] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) =>{
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            body: JSON.stringify({orderId: OrderID, price: Price}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
        };

        const response = await fetch("http://localhost:1339/orders", requestOptions);

        const result = await response.json();
        if(response.status === 400){
            navigate("/", { state: {errorMessage: result.errorMessage}});
        }
        else if(response.status === 500){
            navigate("/systemerror", { state: {errorMessage: result.errorMessage}});
        }
        else
        {

            props.setAdded(result);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="OrderID">Order Id</label>
            <input type="text" placeholder="Order Id" onChange={(e) => setOldId(e.target.value)}/>  
            <label htmlFor="Price">New Price</label>
            <input type="text" placeholder="New Price" onChange={(e) => setNewPrice(e.target.value)}/>
            {OrderID && Price && <button type="submit">New Order</button>}        
        </form>
    )

}

export { AddOrderForm }