import React from "react";
import { Link } from "@tanstack/react-router";
import { useCart } from "../features/cart/context/CartContext";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
} from "./ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";

export function Cart() {
	const { cart, removeFromCart, cartCount } = useCart();

	const total = cart.reduce((acc, item) => {
		const price = Number(item.price);
		const safePrice = Number.isFinite(price) ? price : 0;
		return acc + safePrice * item.quantity;
	}, 0);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<ShoppingCart className="h-5 w-5" />
					{cartCount > 0 && (
						<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-lime-500 text-[10px] font-bold text-foreground rounded-none">
							{cartCount}
						</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
				<SheetHeader>
					<SheetTitle>Your Cart</SheetTitle>
				</SheetHeader>
				{cart.length > 0 ? (
					<>
						<ScrollArea className="flex-1 pr-4">
							<div className="space-y-4">
								{cart.map(item => {
									const price = Number(item.price);
									const safePrice = Number.isFinite(price) ? price : 0;
									return (
										<div key={item.id} className="flex items-center justify-between">
											<div>
												<p className="font-semibold">{item.flavour}</p>
												<p className="text-sm text-muted-foreground">
													${safePrice.toFixed(2)} x {item.quantity}
												</p>
											</div>
											<div className="flex items-center gap-4">
												<p className="font-semibold">
													${(safePrice * item.quantity).toFixed(2)}
												</p>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => removeFromCart(item.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									);
								})}
							</div>
						</ScrollArea>
						<SheetFooter className="mt-4">
							<div className="w-full space-y-4">
								<div className="flex justify-between font-bold text-lg">
									<span>Total</span>
									<span>${total.toFixed(2)}</span>
								</div>
								<Button className="w-full" size="lg">
									Checkout
								</Button>
							</div>
						</SheetFooter>
					</>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
						<p className="text-muted-foreground">Your cart is empty.</p>
						<Button variant="outline" asChild>
							<Link to="/products">Browse products</Link>
						</Button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
