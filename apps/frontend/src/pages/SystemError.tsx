import React from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { RouteSearchParams } from "../shared/types/routes.types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";

interface SystemErrorProps {
	errorMessage?: string;
}

function SystemError({ errorMessage }: SystemErrorProps): React.JSX.Element {
	const search = useSearch({ strict: false }) as RouteSearchParams;
	const displayError =
		errorMessage || search?.errorMessage || "An unknown error occurred";

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl text-destructive">
						System Error
					</CardTitle>
					<CardDescription>
						Oops! looks like our under resourced systems are broken
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{displayError}</AlertDescription>
					</Alert>
					<div className="flex justify-center">
						<Link to="/">
							<Button>Return Home</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default SystemError;
