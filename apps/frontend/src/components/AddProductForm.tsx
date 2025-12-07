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
import {
	productTypeOptions,
	benefitOptions,
	ingredientOptions,
} from "../shared/constants/productOptions";

const typeEnumValues = ["Pre-workout", "Protein-powder"] as const;
const ingredientEnumValues = ingredientOptions.map((o) => o.value) as [string, ...string[]];
const benefitEnumValues = benefitOptions.map((o) => o.value) as [string, ...string[]];
const productFormSchema = z
	.object({
		flavour: z.string().min(1, "Flavour is required"),
		type: z.enum(typeEnumValues, "Type must be Pre-workout or Protein-powder"),
		price: z.string().min(1, "Price is required"),
		description: z.string().optional(),
		ingredients: z.array(z.enum(ingredientEnumValues)).optional(),
		benefits: z.array(z.enum(benefitEnumValues)).optional(),
		rating: z.string().optional(),
		calories: z.string().optional(),
		protein: z.string().optional(),
		carbs: z.string().optional(),
		fat: z.string().optional(),
	})
	.refine(
		(values) => {
			const hasAnyNutrition = [values.calories, values.protein, values.carbs, values.fat].some(
				(v) => v && v.trim() !== "",
			);
			if (!hasAnyNutrition) return true;
			return [values.calories, values.protein, values.carbs, values.fat].every(
				(v) => v && v.trim() !== "" && !Number.isNaN(Number(v)),
			);
		},
		{
			message: "Provide calories, protein, carbs, and fat as numbers to include nutrition",
			path: ["calories"],
		},
	);

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
			type: undefined,
			price: "",
			description: "",
			ingredients: [],
			benefits: [],
			rating: "",
			calories: "",
			protein: "",
			carbs: "",
			fat: "",
		} satisfies Partial<ProductFormValues>,
	});

	const handleSubmit: (values: ProductFormValues) => Promise<void> = async (values) => {
		try {
			const toNumber = (value: string | undefined) => {
				if (!value || value.trim() === "") return undefined;
				const num = Number(value);
				return Number.isFinite(num) ? num : undefined;
			};

			const ingredients = values.ingredients && values.ingredients.length > 0 ? values.ingredients : undefined;
			const benefits = values.benefits && values.benefits.length > 0 ? values.benefits : undefined;
			const rating = toNumber(values.rating);

			const calories = toNumber(values.calories);
			const protein = toNumber(values.protein);
			const carbs = toNumber(values.carbs);
			const fat = toNumber(values.fat);
			const hasNutrition = [calories, protein, carbs, fat].every((v) => v !== undefined);
			const nutrition = hasNutrition
				? { calories: calories as number, protein: protein as number, carbs: carbs as number, fat: fat as number }
				: undefined;

			const result = await createProduct.mutateAsync({
				flavour: values.flavour,
				type: values.type,
				price: Number(values.price),
				description: values.description || "",
				ingredients,
				benefits,
				rating,
				nutrition,
			});
			props.setAdded(result);
			form.reset();
		} catch (error: unknown) {
			const errorMessage =
				(error as { errorMessage?: string; message?: string }).errorMessage ||
				(error as { errorMessage?: string; message?:string }).message ||
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
								<select
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
									{...field}
								>
									<option value="">Select type</option>
									{productTypeOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
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

				<FormField
					control={form.control}
					name="ingredients"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ingredients</FormLabel>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{ingredientOptions.map((option) => {
									const checked = field.value?.includes(option.value) ?? false;
									return (
										<label
											key={option.value}
											className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
										>
											<input
												type="checkbox"
												checked={checked}
												onChange={(e) => {
													const current = field.value || [];
													if (e.target.checked) {
														field.onChange([...current, option.value]);
													} else {
														field.onChange(current.filter((v: string) => v !== option.value));
													}
												}}
											/>
											<span>{option.label}</span>
										</label>
									);
								})}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="benefits"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Benefits</FormLabel>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{benefitOptions.map((option) => {
									const checked = field.value?.includes(option.value) ?? false;
									return (
										<label
											key={option.value}
											className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
										>
											<input
												type="checkbox"
												checked={checked}
												onChange={(e) => {
													const current = field.value || [];
													if (e.target.checked) {
														field.onChange([...current, option.value]);
													} else {
														field.onChange(current.filter((v: string) => v !== option.value));
													}
												}}
											/>
											<span>{option.label}</span>
										</label>
									);
								})}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="rating"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rating (0-5)</FormLabel>
							<FormControl>
								<Input placeholder="e.g. 4.9" inputMode="decimal" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<FormField
						control={form.control}
						name="calories"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Calories</FormLabel>
								<FormControl>
									<Input placeholder="120" inputMode="decimal" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="protein"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Protein (g)</FormLabel>
								<FormControl>
									<Input placeholder="24" inputMode="decimal" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="carbs"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Carbs (g)</FormLabel>
								<FormControl>
									<Input placeholder="3" inputMode="decimal" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="fat"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Fat (g)</FormLabel>
								<FormControl>
									<Input placeholder="1" inputMode="decimal" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" disabled={createProduct.isPending}>
					{createProduct.isPending ? "Adding..." : "Add Product"}
				</Button>
			</form>
		</Form>
	);
}

export { AddProductForm };
