import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { SingleProduct } from "../components/SingleProduct";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function GetProduct(): React.JSX.Element {
	return (
		<div className="container mx-auto px-4 py-24 max-w-3xl text-center space-y-8">
			<div className="space-y-2">
				<h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">
					import React from "react";
					import ErrorBoundary from "../components/ErrorBoundary";
					import {SingleProduct} from "../components/SingleProduct";
					import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card";

					function GetProduct(): React.JSX.Element {
	return (
					<div className="container mx-auto px-4 py-24 max-w-3xl text-center space-y-8">
						<div className="space-y-2">
							<h1 className="text-4xl font-serif font-bold text-[#1a1a1a]">
								Search <span className="text-lime-500 italic">Collection</span>
							</h1>
							<p className="text-gray-500 text-lg">
								Find specific products by flavour or name
							</p>
						</div>

						<div className="p-10 text-left">
							<ErrorBoundary>
								<SingleProduct />
							</ErrorBoundary>
						</div>
					</div>
					);
}

					export default GetProduct;
