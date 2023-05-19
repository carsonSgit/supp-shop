import { useState } from "react";

/**
 * Component representing the form for deleting an order.
 * 
 * @param {Object} props - The props passed to the component.
 * @param {Function} props.setAdded - Function to set the added order.
 * @returns {JSX.Element} - DeleteOrderForm component.
 */
function DeleteOrderForm(props) {
  const [OrderID, setId] = useState(null);

  /**
   * Handler method that makes the delete request based on the form values.
   * @param {Object} event - The event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch(
      "http://localhost:1339/orders/" + OrderID,
      requestOptions
    );
    const result = await response.json();
    props.setAdded(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="oldOrderID">Current Order Id</label>
      <input
        type="text"
        placeholder="Current Order Id"
        onChange={(e) => setId(e.target.value)}
      />
      {OrderID && <button type="submit">Delete Order</button>}
    </form>
  );
}

export { DeleteOrderForm };
