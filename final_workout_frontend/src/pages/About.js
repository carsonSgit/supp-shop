import { useParams, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";

function About(){
    const {employee} = useParams();
    const [cookies,setCookie] = useCookies(["lang"]);

    return(
        <div>
            {cookies.lang === "EN" ? 
                <> 
                    <h1>About Us</h1> 
                    <h2>Our Temporary unpaid interns</h2>
                    {employee === "Noah"} <p>=---------------------=</p> <p>Noah is a great coder who loves the gym</p>
                    {employee === "Carson"} <p>=---------------------=</p> <p>Carson is the resident scribe</p>
                    {employee === "Alejandro"} <p>=---------------------=</p> <p></p>
                </>
            : 
                <>
                    <h1>À propos de nous</h1>
                    <h2>Nos stagiaires temporaires non rémunérés</h2>
                    {employee === "Noah"} <p>=---------------------=</p> <p>Noah est un excellent codeur qui aime la gym</p>
                    {employee === "Carson"} <p>=---------------------=</p> <p>Carson est le scribe résident</p>
                    {employee === "Alejandro"} <p>=---------------------=</p> <p></p>
                </>}
        </div>
    );

    
}


export default About;