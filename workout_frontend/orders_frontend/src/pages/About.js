import { useParams, useSearchParams } from "react-router-dom";
function About(){
    const {employee} = useParams();

    return(
        <div>
            <h1>About Us</h1>
            <h3>Our Temporary unpaid interns</h3>
            {employee === "Noah"} +----+ <h4>Noah is a great coder who loves the gym</h4>
            {employee === "Carson"} +---+ <h4>Carson is the resident scribe</h4>
        </div>
    );

    
}


export default About;