import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
} from "./ui/navigation-menu";
import { ShoppingCart, Menu } from "lucide-react";
import LanguageButton from "./LanguageButton";
import { cn } from "../lib/utils";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

/**
 * Component representing the header section of the website.
 *
 * @returns {JSX.Element} - Header component.
 */
function Header(): React.JSX.Element {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	const navItems = [
		{ to: "/", label: "Home" },
		{ to: "/about", label: "About Us" },
		{ to: "/contact", label: "Contact" },
		{ to: "/userlist", label: "List Users" },
		{ to: "/usercreate", label: "Create User" },
		{ to: "/userdelete", label: "Delete User" },
		{ to: "/products", label: "Shop" },
		{ to: "/orders", label: "Orders" },
		{ to: "/session/login", label: "Login" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4">
				{/* Logo/Brand */}
				<Link to="/" className="flex items-center space-x-2">
					<span className="text-xl font-bold">Supplement Shop</span>
				</Link>

				{/* Desktop Navigation */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList className="flex items-center space-x-1">
						{navItems.map((item) => {
							const isActive = currentPath === item.to;
							return (
								<NavigationMenuItem key={item.to}>
									<Link to={item.to}>
										<NavigationMenuLink
											className={cn(
												"group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50",
												isActive && "bg-accent text-accent-foreground",
											)}
										>
											{item.label}
										</NavigationMenuLink>
									</Link>
								</NavigationMenuItem>
							);
						})}
					</NavigationMenuList>
				</NavigationMenu>

				{/* Right side actions */}
				<div className="flex items-center space-x-2">
					{/* Cart Icon */}
					<Button variant="ghost" size="icon" className="relative">
						<ShoppingCart className="h-5 w-5" />
						<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
							0
						</span>
					</Button>

					{/* Language Button */}
					<LanguageButton />

					{/* Mobile Menu */}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
								<SheetDescription>
									Navigate to different sections of the site
								</SheetDescription>
							</SheetHeader>
							<nav className="mt-6 flex flex-col space-y-2">
								{navItems.map((item) => {
									const isActive = currentPath === item.to;
									return (
										<Link key={item.to} to={item.to}>
											<Button
												variant={isActive ? "secondary" : "ghost"}
												className="w-full justify-start"
											>
												{item.label}
											</Button>
										</Link>
									);
								})}
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}

export default Header;
