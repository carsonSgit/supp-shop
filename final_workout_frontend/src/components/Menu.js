import { useNavigate } from "react-router-dom";
import './Menu.css';

function OrderMenu(){

    const navigate = useNavigate();

    const handleAdd= () => {
        navigate("/add");
    };

    const handleFindOne = () => {
        navigate("/getone");
    };

    const handleFindAll = () => {
        navigate("/all");
    };

    const handleUpdate = () => {
        navigate("/update");
    };

    const handleDelete = () => {
        navigate("/delete");
    };

    return (
            <div>
                <button onClick={handleAdd} >Add Order</button>
                <br/>
                <button onClick={handleFindOne} >Get Single Order</button>
                <br/>
                <button onClick={handleFindAll} >Show All Orders</button>
                <br/>
                <button onClick={handleUpdate} >Update Order</button>
                <br/>
                <button onClick={handleDelete}>Delete Order</button>
            </div>
          );
        
}

export default OrderMenu;