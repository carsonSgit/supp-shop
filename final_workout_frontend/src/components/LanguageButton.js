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

  const toggleLanguage = () => {
    setCookie("lang", cookies.lang === "EN" ? "FR" : "EN");
  };

  useEffect(() => {
    toggleLanguage();
  }, []);

  return (
    <Button variant="outline-primary" size="sm" onClick={toggleLanguage}>
      {cookies.lang}
    </Button>
  );
}

export default LanguageButton;
