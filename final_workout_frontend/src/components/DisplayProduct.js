import Card from "./Card";

/**
 * Component to display a given product information
 * @param {Object} product: Product to display containing flavour, type, and price
 * @param {string} heading: String describing the product to display
 * @returns a display object holding the product information
 */
function DisplayProduct(props) {
    return (
        <>
            <Card>
                {/* Display the product */}
                <h1>{props.heading}</h1>
                <h2>Flavour: {props.product.flavour}</h2>
                <h2>Type: {props.product.type}</h2>
                <h2>Price: {props.product.price}</h2>
            </Card>
        </>
    );
    
}

export { DisplayProduct };