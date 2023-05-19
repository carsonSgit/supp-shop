import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Component that lets the user enter the order ID and price to add a new order,
 * and calls the backend to add it.
 * 
 * @props {function} setAdded: To pass back the added order by side-effect 
 * @returns  JSX containing the form.
 */
function AddOrderForm(props) {
  const [OrderID, setOldId] = useState(null);
  const [Price, setNewPrice] = useState(null);
  const navigate = useNavigate();

  /**
   * Handler method that makes the fetch request based on the form values.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    /** Options that indicate a post request passing in JSON body */
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ orderId: OrderID, price: Price }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch("http://localhost:1339/orders", requestOptions);
    const result = await response.json();
    
    if (response.status === 400) {
      navigate("/", { state: { errorMessage: result.errorMessage } });
    } else if (response.status === 500) {
      navigate("/systemerror", { state: { errorMessage: result.errorMessage } });
    } else {
      props.setAdded(result);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="OrderID">Order Id</label>
      <input
        type="text"
        placeholder="Order Id"
        onChange={(e) => setOldId(e.target.value)}
      />
      <label htmlFor="Price">New Price</label>
      <input
        type="text"
        placeholder="New Price"
        onChange={(e) => setNewPrice(e.target.value)}
      />
      {OrderID && Price && <button type="submit">New Order</button>}
    </form>
  );
}

export { AddOrderForm };
