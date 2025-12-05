import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { SingleProduct } from "../components/SingleProduct";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function GetProduct(): React.JSX.Element {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">
						Type in the product you want to look for
					</CardTitle>
					<CardDescription>
						Search for a product by its flavour
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ErrorBoundary>
						<SingleProduct />
					</ErrorBoundary>
				</CardContent>
			</Card>
		</div>
	);
}

export default GetProduct;
