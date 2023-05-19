import { useNavigate } from "react-router-dom";
import './Menu.css';

function ProductMenu(){

    const navigate = useNavigate();

    const handleAdd= () => {
        navigate("/productsAdd");
    };

    const handleFindOne = () => {
        navigate("/getProduct");
    };

    const handleFindAll = () => {
        navigate("/getProducts");
    };

    const handleUpdate = () => {
        navigate("/productsUpdate");
    };

    const handleDelete = () => {
        navigate("/productsDelete");
    };

    return (
        <div>
            <button id="menuButton" onClick={handleAdd} >Add Product</button>
            <br/>
            <button id="menuButton" onClick={handleFindOne} >Get Single Product</button>
            <br/>
            <button id="menuButton" onClick={handleFindAll} >Show All Products</button>
            <br/>
            <button id="menuButton" onClick={handleUpdate} >Update Products</button>
            <br/>
            <button id="menuButton" onClick={handleDelete}>Delete Products</button>
        </div>
    );
        
}

export default ProductMenu;