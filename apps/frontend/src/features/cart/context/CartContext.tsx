import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../../../api/types";

export interface CartItem extends Product {
	quantity: number;
}

interface CartContextType {
	cart: CartItem[];
	addToCart: (product: Product, quantity: number) => void;
	removeFromCart: (productId: string | undefined) => void;
	clearCart: () => void;
	cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
	children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): React.JSX.Element {
	const [cart, setCart] = useState<CartItem[]>([]);

	useEffect(() => {
		const storedCart = localStorage.getItem("cart");
		if (storedCart) {
			setCart(JSON.parse(storedCart));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	const addToCart = (product: Product, quantity: number) => {
		setCart(prevCart => {
			const existingItem = prevCart.find(item => item._id === product._id);
			if (existingItem) {
				return prevCart.map(item =>
					item._id === product._id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			}
			return [...prevCart, { ...product, quantity }];
		});
	};

	const removeFromCart = (productId: string | undefined) => {
		if (productId === undefined) return;
		setCart(prevCart => prevCart.filter(item => item._id !== productId));
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
