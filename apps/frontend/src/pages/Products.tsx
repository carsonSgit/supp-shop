import React from "react";
import ProductMenu from "../components/ProductMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function Products(): React.JSX.Element {
	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">Shop Menu</CardTitle>
					<CardDescription>
						Browse our selection of premium supplements
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProductMenu />
				</CardContent>
			</Card>
		</div>
	);
}

export default Products;
