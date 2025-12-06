import { z } from "zod";

const normalizeType = (value: string) => {
	const trimmed = value.trim();
	const lowered = trimmed.toLowerCase().replace(/\s+/g, "-");
	if (lowered === "pre-workout" || lowered === "preworkout") return "Pre-workout" as const;
	if (lowered === "protein-powder" || lowered === "proteinpowder") return "Protein-powder" as const;
	return trimmed as never;
};

const typeSchema = z
	.string()
	.min(1, "type is required")
	.transform(normalizeType)
	.refine((val) => val === "Pre-workout" || val === "Protein-powder", {
		message: "type must be Pre-workout or Protein-powder",
	});

const nutritionSchema = z.object({
	calories: z.coerce.number().nonnegative(),
	protein: z.coerce.number().nonnegative(),
	carbs: z.coerce.number().nonnegative(),
	fat: z.coerce.number().nonnegative(),
});

export const productCreateSchema = z.object({
	flavour: z.string().min(1, "flavour is required"),
	type: typeSchema,
	price: z.coerce.number().positive(),
	description: z.string().trim().min(1).optional(),
	ingredients: z.array(z.string().trim().min(1)).optional(),
	nutrition: nutritionSchema.optional(),
	benefits: z.array(z.string().trim().min(1)).optional(),
	rating: z.coerce.number().min(0).max(5).optional(),
});

export const productUpdateSchema = z.object({
	flavour: z.string().min(1, "flavour is required"),
	type: typeSchema,
	updatePrice: z.coerce.number().positive(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

