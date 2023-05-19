import { useState } from "react";
import { AddOrderForm } from "./AddOrderForm";
import { DisplayOrder } from "./DisplayOrder";

/**
 * Component that handles the process of adding an order.
 * 
 * @returns  JSX containing the add order form and the display of the added order.
 */
function AddOrder() {
  const [added, setAdded] = useState({});

  return (
    <>
      <AddOrderForm setAdded={setAdded} />
      <DisplayOrder order={added} heading="The added order is: " />
    </>
  );
}

export { AddOrder };