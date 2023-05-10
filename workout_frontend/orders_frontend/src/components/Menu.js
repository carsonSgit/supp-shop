import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";


function Menu(){

    const navigate = useNavigate();
    return (
            <div className="d-flex justify-content-center flex-column">
                <Button variant="primary" onClick={navigate("/addorder")} >Add Order</Button>
                < p/>
                <Button variant="primary" onClick={navigate("/getorder")} >Get Single Order</Button>
                <p />
                <Button variant="primary" onClick={navigate("/allorders")} >Show All Orders</Button>
                 <p />
                <Button variant="primary" onClick={navigate("/update")} >Update Order</Button>
                <p />
                <Button variant="primary" onClick={navigate("/delete")}>Delete Order</Button>
            </div>
          );
        
}

export default Menu;