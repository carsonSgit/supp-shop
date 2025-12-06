import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateProduct } from "../features/products/hooks/useProducts";
import { FormWithSetUpdatedProps } from "../shared/types/components.types";
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
import { useToast } from "./ui/use-toast";

const updateProductFormSchema = z.object({
	oldFlavour: z.string().min(1, "Current flavour is required"),
	oldType: z.string().optional(),
	oldPrice: z.string().optional(),
	newPrice: z.string().min(1, "New price is required"),
});

type UpdateProductFormValues = z.infer<typeof updateProductFormSchema>;

/**
 * Functionality for updating a product according to given parameters.
 * Uses a PUT request to update the product in the database.
 * @param {Object} props: the parameters of the product to be updated.
 * @returns user-input fields that hold values for the product.
 */
function UpdateProductForm(props: FormWithSetUpdatedProps<Product>): React.JSX.Element {
	const navigate = useNavigate();
	const updateProduct = useUpdateProduct();
	const { toast } = useToast();

	const form = useForm<UpdateProductFormValues>({
		resolver: zodResolver(updateProductFormSchema),
		defaultValues: {
			oldFlavour: "",
			oldType: "",
			oldPrice: "",
			newPrice: "",
		},
	});

	const handleSubmit = async (values: UpdateProductFormValues): Promise<void> => {
		try {
			const priceValue = Number(values.oldPrice) || 0;
			const result = await updateProduct.mutateAsync({
				flavour: values.oldFlavour,
				type: values.oldType || undefined,
				price: priceValue,
				updatePrice: Number(values.newPrice),
			});
			props.setUpdated(result);
			form.reset();
			toast({
				title: "Success",
				description: "Product updated successfully",
			});
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?: string }).message ||
				"Failed to update product";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="oldFlavour"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Flavour</FormLabel>
							<FormControl>
								<Input placeholder="Current Flavour..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="oldType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Type (Optional)</FormLabel>
							<FormControl>
								<Input placeholder="Current Type..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="oldPrice"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Current Price (Optional)</FormLabel>
							<FormControl>
								<Input placeholder="Current Price..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="newPrice"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Price</FormLabel>
							<FormControl>
								<Input placeholder="New Price..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={updateProduct.isPending}>
					{updateProduct.isPending ? "Updating..." : "Update Product"}
				</Button>
			</form>
		</Form>
	);
}

export { UpdateProductForm };
