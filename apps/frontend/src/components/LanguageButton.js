import { useCookies } from "react-cookie";
import { Button } from "react-bootstrap";
import { useEffect } from "react";

/**
 * Component representing the language toggle button.
 *
 * @returns {JSX.Element} - LanguageButton component.
 */
function LanguageButton() {
	const [cookies, setCookie] = useCookies(["lang"]);

	// Initialize cookie to "EN" if it doesn't exist
	useEffect(() => {
		if (!cookies.lang) {
			setCookie("lang", "EN");
		}
	}, [cookies.lang, setCookie]);

	const toggleLanguage = () => {
		setCookie("lang", cookies.lang === "EN" ? "FR" : "EN");
	};

	return (
		<Button variant="outline-primary" size="sm" onClick={toggleLanguage}>
			{cookies.lang || "EN"}
		</Button>
	);
}

export default LanguageButton;
