import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useCookies } from "react-cookie";
import { HomeSearchParams } from "../shared/types/routes.types";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function Home(): React.JSX.Element {
	const search = useSearch({ strict: false }) as HomeSearchParams;
	const [cookies] = useCookies(["lang"]);

	return (
		<div className="container mx-auto px-4 py-8" lang={cookies.lang}>
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-4xl">
						{cookies.lang === "EN"
							? "Welcome to NAC Supplements"
							: "Bienvenue à CAN Suppléments"}
					</CardTitle>
					<CardDescription className="text-xl">
						{cookies.lang === "EN" ? (
							<>Hello {search?.name || "Guest"}</>
						) : (
							<>Bonjour {search?.name || "Invité"}</>
						)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{search?.errorMessage && (
						<Alert variant="destructive" className="mt-4">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{search.errorMessage}</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default Home;
