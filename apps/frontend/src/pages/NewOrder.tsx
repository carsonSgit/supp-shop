import React from "react";
import { AddOrder } from "../components/AddOrder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function AddNewOrder(): React.JSX.Element {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-3xl">
						Welcome, would you like to add an order
					</CardTitle>
					<CardDescription>
						Fill out the form below to create a new order
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AddOrder />
				</CardContent>
			</Card>
		</div>
	);
}

export default AddNewOrder;
