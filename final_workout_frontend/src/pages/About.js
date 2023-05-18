import { useParams, useSearchParams } from "react-router-dom";
function About(){
    const {employee} = useParams();

    return(
        <div>
            <h1>About Us</h1>
            <h2>Our Temporary unpaid interns</h2>
            {employee === "Noah"} <p>=---------------------=</p> <p>Noah is a great coder who loves the gym</p>
            {employee === "Carson"} <p>=---------------------=</p> <p>Carson is the resident scribe</p>
        </div>
    );

    
}


export default About;