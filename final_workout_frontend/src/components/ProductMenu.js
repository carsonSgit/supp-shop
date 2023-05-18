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
                <button onClick={handleAdd} >Add Product</button>
                <br/>
                <button onClick={handleFindOne} >Get Single Product</button>
                <br/>
                <button onClick={handleFindAll} >Show All Products</button>
                <br/>
                <button onClick={handleUpdate} >Update Products</button>
                <br/>
                <button onClick={handleDelete}>Delete Products</button>
            </div>
          );
        
}

export default ProductMenu;