import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { SingleOrder } from "../components/SingleOrder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function GetOne(): React.JSX.Element {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">
						Type in the order you want to look for
					</CardTitle>
					<CardDescription>
						Search for an order by its order ID
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ErrorBoundary>
						<SingleOrder />
					</ErrorBoundary>
				</CardContent>
			</Card>
		</div>
	);
}

export default GetOne;
