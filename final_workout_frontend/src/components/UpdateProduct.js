import { useState } from "react";
import { UpdateProductForm } from "./UpdateProductForm";
import { DisplaySuccess } from "./DisplaySuccess";

/**
 * Simple component that renders displays.
 * @returns a user-input field and a display-card for the updated product.
 */
function UpdateProduct() {
    const [updated, setUpdated] = useState({});
    // doesn't display the updated...
    return (
        <>
            <UpdateProductForm setUpdated={setUpdated} />
            <DisplaySuccess product={updated} heading="Update" />
        </>
    );
}

export { UpdateProduct };