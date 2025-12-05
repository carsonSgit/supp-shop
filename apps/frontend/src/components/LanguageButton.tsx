import React from "react";
import { Button } from "./ui/button";
import { useLanguage } from "../shared/hooks/useLanguage";

/**
 * Component representing the language toggle button.
 *
 * @returns {JSX.Element} - LanguageButton component.
 */
function LanguageButton(): React.JSX.Element {
	const { language, toggleLanguage } = useLanguage();

	return (
		<Button variant="outline" size="sm" onClick={toggleLanguage}>
			{language}
		</Button>
	);
}

export default LanguageButton;
