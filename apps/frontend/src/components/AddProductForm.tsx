import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProduct } from "../features/products/hooks/useProducts";
import { FormWithSetAddedProps } from "../shared/types/components.types";
import { Product } from "../api/types";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const productFormSchema = z.object({
	flavour: z.string().min(1, "Flavour is required"),
	type: z.string().min(1, "Type is required"),
	price: z.string().min(1, "Price is required"),
	description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

/**
 * Functionality for adding a product according to given parameters.
 * Uses a POST request to add the product to the database.
 * @param {Object} props: the parameters of the product to be added.
 * @returns user-input fields that hold values for the product.
 */
function AddProductForm(props: FormWithSetAddedProps<Product>): React.JSX.Element {
	const navigate = useNavigate();
	const createProduct = useCreateProduct();

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			flavour: "",
			type: "",
			price: "",
			description: "",
		},
	});

	const handleSubmit = async (values: ProductFormValues): Promise<void> => {
		try {
			const result = await createProduct.mutateAsync({
				flavour: values.flavour,
				type: values.type,
				price: values.price,
				description: values.description || "",
			});
			props.setAdded(result);
			form.reset();
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to create product";
			const errorStatus = (error as { status?: number }).status;
			if (errorStatus === 500) {
				navigate({
					to: "/systemerror",
					search: { errorMessage },
				});
			} else {
				navigate({
					to: "/",
					search: { errorMessage },
				});
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="flavour"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Flavour</FormLabel>
							<FormControl>
								<Input placeholder="Flavour..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type</FormLabel>
							<FormControl>
								<Input placeholder="Type..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price</FormLabel>
							<FormControl>
								<Input placeholder="Price..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Description..."
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Optional description for the product
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={createProduct.isPending}>
					{createProduct.isPending ? "Adding..." : "Add Product"}
				</Button>
			</form>
		</Form>
	);
}

export { AddProductForm };
