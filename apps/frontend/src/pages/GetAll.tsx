import React from "react";
import { AllOrders } from "../components/AllOrders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function GetAll(): React.JSX.Element {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">
						This is the list of all orders placed
					</CardTitle>
					<CardDescription>
						View and manage all orders in the system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AllOrders />
				</CardContent>
			</Card>
		</div>
	);
}

export default GetAll;
