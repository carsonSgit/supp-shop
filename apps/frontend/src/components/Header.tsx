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
import { useAuth } from "../features/auth/context/AuthContext";
import { useTranslation } from "../shared/hooks/useTranslation";

function Header(): React.JSX.Element {
	const router = useRouterState();
	const currentPath = router.location.pathname;
	const { isAuthenticated, isAdmin, logout } = useAuth();
	const t = useTranslation();
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
				isScrolled
					? "bg-background/80 backdrop-blur-md shadow-sm border-border/20 py-2"
					: "bg-transparent py-4"
			)}
		>
			<div className="container flex items-center justify-between px-4">
				{/* Logo */}
				<Link to="/" className="flex items-center space-x-2 group">
					<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground transform group-hover:rotate-12 transition-transform duration-300">
						<Leaf className="h-5 w-5" />
					</div>
					<span className={cn(
						"text-xl font-bold tracking-tight transition-colors",
						!isScrolled && currentPath === "/" ? "text-white" : "text-foreground"
					)}>
						Supplement Shop
					</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-1">
					{navItems.map((item) => {
						const isActive = currentPath === item.to;
						const isHome = currentPath === "/";

						if (item.to === "#" && (item as any).onClick) {
							return (
								<Button
									key={item.label}
									variant="ghost"
									onClick={(item as any).onClick}
									className={cn(
										"text-sm font-medium transition-colors hover:text-primary",
										!isScrolled && isHome ? "text-white/90 hover:text-white hover:bg-white/10" : "text-muted-foreground"
									)}
								>
									{item.label}
								</Button>
							);
						}

						return (
							<Link key={item.to} to={item.to}>
								<Button
									variant="ghost"
									className={cn(
										"text-sm font-medium transition-colors relative",
										!isScrolled && isHome ? "text-white/90 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-primary",
										isActive && "text-primary font-semibold"
									)}
								>
									{item.label}
									{isActive && (
										<motion.div
											layoutId="navbar-indicator"
											className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
											initial={false}
											transition={{ type: "spring", stiffness: 500, damping: 30 }}
										/>
									)}
								</Button>
							</Link>
						);
					})}
				</div>

				{/* Right Actions */}
				<div className="flex items-center space-x-2">
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"relative transition-colors",
							!isScrolled && currentPath === "/" ? "text-white hover:bg-white/10" : "text-foreground"
						)}
					>
						<ShoppingCart className="h-5 w-5" />
						<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
							0
						</span>
					</Button>

					<div className={cn(!isScrolled && currentPath === "/" ? "text-white" : "")}>
						<LanguageButton />
					</div>

					{/* Mobile Menu Toggle */}
					<Button
						variant="ghost"
						size="icon"
						className={cn("md:hidden", !isScrolled && currentPath === "/" ? "text-white hover:bg-white/10" : "")}
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
