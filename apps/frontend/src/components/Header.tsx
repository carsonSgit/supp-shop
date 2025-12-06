import React, { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
} from "./ui/navigation-menu";
import { ShoppingCart, Menu, X, Leaf } from "lucide-react";
import LanguageButton from "./LanguageButton";
import { cn } from "../lib/utils";
import { Cart } from "./Cart";
import { useAuth } from "../features/auth/context/AuthContext";
import { useTranslation } from "../shared/hooks/useTranslation";

function Header(): React.JSX.Element {
	const router = useRouterState();
	const currentPath = router.location.pathname;
	const { isAuthenticated, isAdmin, logout } = useAuth();
	const t = useTranslation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Public navigation items
	const publicNavItems = [
		{ to: "/", label: t.nav.home },
		{ to: "/products", label: t.nav.shop },
		{ to: "/about", label: t.nav.aboutUs },
		{ to: "/contact", label: t.nav.contact },
	];

	// Admin-only navigation items
	const adminNavItems = [
		{ to: "/orders", label: t.nav.orders },
		{ to: "/productsAdd", label: "Manage" },
	];

	const navItems = [
		...publicNavItems,
		...(isAdmin ? adminNavItems : []),
		...(isAuthenticated
			? [{ to: "#", label: t.nav.logout, onClick: logout }]
			: [{ to: "/session/login", label: t.nav.login }]
		),
	];

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
			className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm border-b"
		>
			<div className="container flex items-center justify-between px-4 h-20">

				{/* Desktop Navigation (Centered) */}
				<nav className="hidden md:flex items-center space-x-12 mx-auto">
					{navItems.map((item) => {
						const isActive = currentPath === item.to;
						if (item.to === "#" && (item as any).onClick) {
							return (
								<button
									key={item.label}
									onClick={(item as any).onClick}
									className="text-lg font-serif transition-colors hover:text-primary tracking-tight text-foreground"
								>
									{item.label}
								</button>
							);
						}

						return (
							<Link key={item.to} to={item.to} className="relative group">
								<span
									className={cn(
										"text-lg font-serif transition-colors tracking-tight block py-2 text-foreground",
										isActive && "text-lime-600"
									)}
								>
									{item.label}
								</span>
								{isActive && (
									<span className="absolute bottom-0 left-0 w-full h-0.5 bg-lime-500" />
								)}
							</Link>
						);
					})}
				</nav>

				{/* Right Actions */}
				<div className="flex items-center space-x-6 absolute right-8">
					<Cart />

					<div className="text-foreground">
						<LanguageButton />
					</div>

					{/* Mobile Menu Toggle */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden text-foreground"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</Button>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden bg-background border-b border-border/50 overflow-hidden"
					>
						<div className="container px-4 py-4 space-y-2">
							{navItems.map((item) => (
								<div key={item.label}>
									{item.to === "#" ? (
										<Button
											variant="ghost"
											className="w-full justify-start"
											onClick={() => {
												(item as any).onClick?.();
												setMobileMenuOpen(false);
											}}
										>
											{item.label}
										</Button>
									) : (
										<Link to={item.to} onClick={() => setMobileMenuOpen(false)}>
											<Button
												variant={currentPath === item.to ? "secondary" : "ghost"}
												className="w-full justify-start"
											>
												{item.label}
											</Button>
										</Link>
									)}
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}

export default Header;
