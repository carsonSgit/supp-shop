import React from "react";
import { useState, useEffect } from "react";
import { useProduct } from "../features/products/hooks/useProducts";
import { FormWithSetFetchedProps } from "../shared/types/components.types";
import { Product } from "../api/types";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const productFormSchema = z.object({
	flavour: z.string().min(1, "Product flavour is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

/**
 * Component representing the form to get a single product.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.setFetched - Function to set the fetched product.
 * @returns {JSX.Element} - Get single product form component.
 */
function GetSingleProductForm(props: FormWithSetFetchedProps<Product>): React.JSX.Element {
	const [submittedFlavour, setSubmittedFlavour] = useState("");
	const { data, isLoading, error } = useProduct(submittedFlavour);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			flavour: "",
		},
	});

	useEffect(() => {
		if (data) {
			props.setFetched(data);
		}
	}, [data, props]);

	const handleSubmit = async (values: ProductFormValues): Promise<void> => {
		if (values.flavour) {
			setSubmittedFlavour(values.flavour);
		}
	};

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="flavour"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product Flavour</FormLabel>
								<FormControl>
									<Input placeholder="Product Flavour" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Loading..." : "Get Product"}
					</Button>
				</form>
			</Form>

			{isLoading && (
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			)}

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>Error: {error.message}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}

export { GetSingleProductForm };
