import { useState } from "react";
import { DeleteProductForm } from "./DeleteProductForm";
import { DisplaySuccess } from "./DisplaySuccess";

/**
 * Component that handles the process of deleting a product.
 * 
 * @returns  JSX containing the delete product form and the display of the success message.
 */
function DeleteProduct() {
  const [deleted, setDeleted] = useState({});

  return (
    <>
      <DeleteProductForm setDeleted={setDeleted} />
      <DisplaySuccess product={deleted} heading="Delete" />
    </>
  );
}

export { DeleteProduct };
