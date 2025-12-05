import { useLanguage } from "./useLanguage";
import { translations } from "../utils/translations";

/**
 * Hook to get translated strings
 * Usage: const t = useTranslation(); t.pages.home.title
 */
export function useTranslation() {
	const { language } = useLanguage();
	return translations[language];
}

