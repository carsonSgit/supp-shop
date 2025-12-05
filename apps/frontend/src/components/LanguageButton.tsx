import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Button } from "./ui/button";

/**
 * Component representing the language toggle button.
 *
 * @returns {JSX.Element} - LanguageButton component.
 */
function LanguageButton(): React.JSX.Element {
	const [cookies, setCookie] = useCookies(["lang"]);

	// Initialize cookie to "EN" if it doesn't exist
	useEffect(() => {
		if (!cookies.lang) {
			setCookie("lang", "EN");
		}
	}, [cookies.lang, setCookie]);

	const toggleLanguage = (): void => {
		setCookie("lang", cookies.lang === "EN" ? "FR" : "EN");
	};

	return (
		<Button variant="outline" size="sm" onClick={toggleLanguage}>
			{cookies.lang || "EN"}
		</Button>
	);
}

export default LanguageButton;
