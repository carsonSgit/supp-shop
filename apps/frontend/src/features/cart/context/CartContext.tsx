import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../../../api/types";

export interface CartItem extends Product {
	id: string;
	quantity: number;
}

interface CartContextType {
	cart: CartItem[];
	addToCart: (product: Product, quantity: number) => void;
	removeFromCart: (productId: string) => void;
	clearCart: () => void;
	cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getProductId = (product: Partial<Product>): string => {
	return product._id ?? product.flavour ?? "";
};

const normalizeCartItems = (data: unknown): CartItem[] => {
	if (!Array.isArray(data)) return [];

	return data
		.map(item => {
			const id = getProductId(item as Product);
			if (!id) return null;

			const rawQty = Number((item as Product).quantity);
			const quantity = Number.isFinite(rawQty) && rawQty > 0 ? rawQty : 1;
			const rawPrice = Number((item as Product).price);
			const price = Number.isFinite(rawPrice) ? rawPrice : 0;

			return {
				...(item as Product),
				id,
				quantity,
				price,
			} satisfies CartItem;
		})
		.filter((item): item is CartItem => item !== null);
};

interface CartProviderProps {
	children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): React.JSX.Element {
	const [cart, setCart] = useState<CartItem[]>([]);

	useEffect(() => {
		const storedCart = localStorage.getItem("cart");
		if (storedCart) {
			try {
				const parsed = JSON.parse(storedCart) as CartItem[];
				setCart(normalizeCartItems(parsed));
			} catch {
				setCart([]);
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	const addToCart = (product: Product, quantity: number) => {
		const id = getProductId(product);
		if (!id) return;
		const price = Number(product.price);

		setCart(prevCart => {
			const existingItem = prevCart.find(item => item.id === id);
			if (existingItem) {
				return prevCart.map(item =>
					item.id === id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			}
			return [...prevCart, { ...product, id, quantity, price: Number.isFinite(price) ? price : 0 }];
		});
	};

	const removeFromCart = (productId: string) => {
		setCart(prevCart => prevCart.filter(item => item.id !== productId));
	};

	const clearCart = () => {
		setCart([]);
	};

	const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				clearCart,
				cartCount,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart(): CartContextType {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
