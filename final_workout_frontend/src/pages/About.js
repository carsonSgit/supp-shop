import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

/**
 * Component representing the About page.
 *
 * @returns {JSX.Element} - About component.
 */
function About() {
    const { employee } = useParams();
    const [cookies, setCookie] = useCookies(["lang"]);

    return (
        <div>
            {cookies.lang === "EN" ? (
                <>
                    <h1>About Us</h1>
                    <h2>Our Temporary unpaid interns</h2>
<<<<<<< Updated upstream
                    {employee === "Noah" && (
                        <>
                            <p>=---------------------=</p>
                            <p>Noah is a great coder who loves the gym</p>
                        </>
                    )}
                    {employee === "Carson" && (
                        <>
                            <p>=---------------------=</p>
                            <p>Carson is the resident scribe</p>
                        </>
                    )}
                    {employee === "Alejandro" && (
                        <>
                            <p>=---------------------=</p>
                            <p></p>
                        </>
                    )}
=======
                    {employee === "Noah"} <p>=---------------------=</p> <p>Noah is a great coder who loves the gym</p>
                    {employee === "Carson"} <p>=---------------------=</p> <p>Carson is the resident scribe</p>
                    {employee === "Alejandro"} <p>=---------------------=</p> <p>Alejandro is talking to the voices</p>
>>>>>>> Stashed changes
                </>
            ) : (
                <>
                    <h1>À propos de nous</h1>
                    <h2>Nos stagiaires temporaires non rémunérés</h2>
<<<<<<< Updated upstream
                    {employee === "Noah" && (
                        <>
                            <p>=---------------------=</p>
                            <p>Noah est un excellent codeur qui aime la gym</p>
                        </>
                    )}
                    {employee === "Carson" && (
                        <>
                            <p>=---------------------=</p>
                            <p>Carson est le scribe résident</p>
                        </>
                    )}
                    {employee === "Alejandro" && (
                        <>
                            <p>=---------------------=</p>
                            <p></p>
                        </>
                    )}
                </>
            )}
=======
                    {employee === "Noah"} <p>=---------------------=</p> <p>Noah est un excellent codeur qui aime la gym</p>
                    {employee === "Carson"} <p>=---------------------=</p> <p>Carson est le scribe résident</p>
                    {employee === "Alejandro"} <p>=---------------------=</p> <p>Alejandro parle aux voix dans sa tete</p>
                </>}
>>>>>>> Stashed changes
        </div>
    );
}

export default About;
