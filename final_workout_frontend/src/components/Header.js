import NavButton from "./NavButton";

function Header(){

    return (
        <div>
            <div>
                <NavButton to="/" label="Home"/>
                <NavButton to="/about" label="About Us"/>
                <NavButton to="/contact" label="Contact"/>
                <NavButton to="/userlist" label="List Users"/>
                <NavButton to="/usercreate" label="Create User"/>
                <NavButton to="/userdelete" label="Delete User"/>
                <NavButton to="/products" label="Shop" />
                <NavButton label="View Cart"/>
                <NavButton to="/orders" label="Orders" />
                <NavButton to="/session/login" label="Login" />


            </div>
        </div>
    );
}

export default Header;