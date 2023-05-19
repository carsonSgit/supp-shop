import { useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Functionality for adding a product according to given parameters.
 * Uses a POST request to add the product to the database.
 * @param {Object} props: the parameters of the product to be added.
 * @returns user-input fields that hold values for the product.
 */
function AddProductForm(props) {
    const flavourRef = useRef(null);
    const typeRef = useRef(null);
    const priceRef = useRef(null);
    const descriptionRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                flavour: flavourRef.current.value,
                type: typeRef.current.value,
                price: priceRef.current.value,
                description: descriptionRef.current.value
            }),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        };
        const response = await fetch("http://localhost:1339/products", requestOptions);
        const result = await response.json();
        if(response.status === 400) {
            navigate("/", {state: {errorMessage: result.errorMessage}});
        } else if( response.status === 500){
            navigate("/systemerror", {state: {errorMessage: result.errorMessage}});
        }
        else {
            props.setAdded(result);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="flavour">Flavour:</label>
            <input type="text" placeholder="Flavour..." ref={flavourRef} required />
            
            <label htmlFor="type">Type:</label>
            <input type="text" placeholder="Type..." ref={typeRef} required />
            
            <label htmlFor="price">Price:</label>
            <input type="text" placeholder="Price..." ref={priceRef} required />
            
            <label htmlFor="description">Description:</label>
            <input type="text" placeholder="Description..." ref={descriptionRef} required />
            
            <button type="submit">Add Product</button>
        </form>
    );
}

export { AddProductForm };