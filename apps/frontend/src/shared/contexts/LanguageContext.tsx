import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useCookies } from "react-cookie";

type Language = "EN" | "FR";

interface LanguageContextType {
	language: Language;
	toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
	children: ReactNode;
}

/**
 * Language Context Provider
 * Manages language state and syncs with cookies
 */
export function LanguageProvider({ children }: LanguageProviderProps): React.JSX.Element {
	const [cookies, setCookie] = useCookies(["lang"]);
	const [language, setLanguage] = useState<Language>((cookies.lang as Language) || "EN");

	// Sync state with cookie on mount and when cookie changes
	useEffect(() => {
		const cookieLang = cookies.lang as Language;
		if (cookieLang === "EN" || cookieLang === "FR") {
			setLanguage(cookieLang);
		} else {
			// Initialize cookie if not set
			setCookie("lang", "EN", { path: "/" });
			setLanguage("EN");
		}
	}, [cookies.lang, setCookie]);

	const toggleLanguage = (): void => {
		const newLang: Language = language === "EN" ? "FR" : "EN";
		setCookie("lang", newLang, { path: "/" });
		setLanguage(newLang);
	};

	return (
		<LanguageContext.Provider value={{ language, toggleLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
}

/**
 * Hook to use language context
 * @throws Error if used outside LanguageProvider
 */
export function useLanguage(): LanguageContextType {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}

