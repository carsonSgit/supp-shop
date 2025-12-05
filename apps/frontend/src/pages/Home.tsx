import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useLanguage } from "../shared/hooks/useLanguage";
import { useTranslation } from "../shared/hooks/useTranslation";
import { HomeSearchParams } from "../shared/types/routes.types";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function Home(): React.JSX.Element {
	const search = useSearch({ strict: false }) as HomeSearchParams;
	const { language } = useLanguage();
	const t = useTranslation();

	return (
		<div className="container mx-auto px-4 py-8" lang={language}>
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-4xl">
						{t.pages.home.title}
					</CardTitle>
					<CardDescription className="text-xl">
						{t.pages.home.greeting} {search?.name || t.pages.home.guest}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{search?.errorMessage && (
						<Alert variant="destructive" className="mt-4">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>{t.common.error}</AlertTitle>
							<AlertDescription>{search.errorMessage}</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default Home;
