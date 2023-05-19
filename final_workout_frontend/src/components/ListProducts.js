
/**
 * Simple component to display a list of products.
 * @param {Object Array} products: the array of products in the database.
 * @returns a list of all products sorted by id.
 */
function ListProducts( {products} ) {
    return (
        <div>
            <h1>All Products</h1>
            <ul>
                {products.map((products) => (
                    <li key={products._id}>
                        {products.flavour} of type {products.type} for ${products.price}.
                    </li>
                ))}
            </ul>
        </div>
    );
}

export { ListProducts };