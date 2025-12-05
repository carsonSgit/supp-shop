import { useCookies } from "react-cookie";

/**
 * Component representing the Contact Us page.
 *
 * @returns {JSX.Element} - Contact Us component.
 */
function Contact() {
	const [cookies] = useCookies(["lang"]);
	return (
		<div>
			{cookies.lang === "EN" ? (
				<>
					<h1>Contact Us</h1>
				</>
			) : (
				<>
					<h1>Contactez-nous</h1>
				</>
			)}
			<h2>+1(800) 267-2001</h2>
			<h2>nacsupplements@gmail.com</h2>
		</div>
	);
}

export default Contact;
