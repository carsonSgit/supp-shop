import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle2 } from "lucide-react";

interface DisplaySuccessProps {
	heading: string;
}

/**
 * Component to display a given product information
 * @param {Object} product: Product to display containing flavour, type, and price
 * @param {string} heading: String describing the product to display
 * @returns a display object holding the product information
 */
function DisplaySuccess(props: DisplaySuccessProps): React.JSX.Element {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>{props.heading}</CardTitle>
			</CardHeader>
			<CardContent>
				<Alert className="border-green-500 bg-green-50 dark:bg-green-950">
					<CheckCircle2 className="h-4 w-4 text-green-600" />
					<AlertTitle className="text-green-800 dark:text-green-200">
						Success
					</AlertTitle>
					<AlertDescription className="text-green-700 dark:text-green-300">
						{props.heading}
					</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
}

export { DisplaySuccess };
