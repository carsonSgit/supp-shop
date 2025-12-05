import React from "react";
import ProductMenu from "../components/ProductMenu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useTranslation } from "../shared/hooks/useTranslation";

function Products(): React.JSX.Element {
	const t = useTranslation();
	
	return (
		<div className="container mx-auto px-4 py-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">{t.pages.products.title}</CardTitle>
					<CardDescription>
						{t.pages.products.subtitle}
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
