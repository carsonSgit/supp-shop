import proteinChoc from "../../assets/products/protein_chocolate.png";
import proteinVanilla from "../../assets/products/protein_vanilla.png";
import prePunch from "../../assets/products/preworkout_punch.png";

const productImages: Record<string, string> = {
	Chocolate: proteinChoc,
	Vanilla: proteinVanilla,
	"Fruit Punch": prePunch,
	Raspberry: prePunch,
};

/**
 * Return a product hero image for a given flavour with a sensible fallback.
 */
export function getProductImage(flavour: string | undefined): string {
	if (!flavour) return proteinChoc;
	return productImages[flavour] || proteinChoc;
}

