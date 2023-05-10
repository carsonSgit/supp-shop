import { Link } from "react-router-dom";
import HomeButton from "./HomeButton";
import { NavLink } from "react-router-dom";
import NavButton from "./NavButton";

function Header(){
    return(
        <div>
            <div>
                <NavButton to="/" label="Home"/>
                <NavButton to="/about" label="About Us" />
                <NavButton to="/contact" label="Contact Us" />
                <NavButton to="/orders" label="Orders"      />      
            </div>
            <div>
                <HomeButton />
            </div>
        </div>
        
    );
}


export default Header