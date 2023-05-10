import { useNavigate } from "react-router-dom";

function HomeButton(){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };


    return<button onClick={handleClick}>Home</button>;
}

export default HomeButton;