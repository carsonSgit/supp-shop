import React from "react";
import OrderMenu from "../components/Menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function Orders(): React.JSX.Element {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl">
						Welcome to the orders main page
					</CardTitle>
					<CardDescription>
						Manage your orders and view order history
					</CardDescription>
				</CardHeader>
				<CardContent>
					<OrderMenu />
				</CardContent>
			</Card>
		</div>
	);
}

export default Orders;
