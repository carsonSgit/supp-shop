import React from "react";
import { Link } from "@tanstack/react-router";
import { Separator } from "./ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { useTranslation } from "../shared/hooks/useTranslation";

/**
 * Component representing the footer section of the website.
 *
 * @returns {JSX.Element} - Footer component.
 */
function Footer(): React.JSX.Element {
	const t = useTranslation();

	return (
		<footer className="border-t border-gray-100 bg-white pt-20 pb-10">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-20">
					{/* Company Info */}
					<div className="space-y-6">
						<h3 className="font-serif text-2xl font-bold tracking-tight text-[#1a1a1a]">
							{t.footer.supplementShop}
						</h3>
						<p className="text-gray-500 leading-relaxed max-w-xs">
							{t.footer.tagline}
						</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-8">
						<h4 className="font-serif text-lg font-bold text-[#1a1a1a] uppercase tracking-wider text-sm">
							{t.footer.quickLinks}
						</h4>
						<div className="flex flex-col space-y-4">
							<Link to="/" className="text-gray-500 hover:text-[#1a1a1a] transition-colors">{t.nav.home}</Link>
							<Link to="/about" className="text-gray-500 hover:text-[#1a1a1a] transition-colors">{t.nav.aboutUs}</Link>
							<Link to="/contact" className="text-gray-500 hover:text-[#1a1a1a] transition-colors">{t.nav.contact}</Link>
							<Link to="/products" className="text-gray-500 hover:text-[#1a1a1a] transition-colors">{t.nav.shop}</Link>
						</div>
					</div>

					{/* Customer Service */}
					<div className="space-y-8">
						<h4 className="font-serif text-lg font-bold text-[#1a1a1a] uppercase tracking-wider text-sm">
							{t.footer.customerService}
						</h4>
						<div className="flex flex-col space-y-4">
							<Link to="/orders" className="text-gray-500 hover:text-[#1a1a1a] transition-colors">{t.nav.orders}</Link>
							<Link to="/contact" className="text-gray-500 hover:text-[#1a1a1a] transition-colors">{t.footer.support}</Link>
						</div>
					</div>

					{/* Contact Info */}
					<div className="space-y-8">
						<h4 className="font-serif text-lg font-bold text-[#1a1a1a] uppercase tracking-wider text-sm">
							{t.footer.contact}
						</h4>
						<div className="space-y-4 text-gray-500">
							<p>{t.footer.email}: <span className="text-[#1a1a1a] block mt-1">{t.footer.emailValue}</span></p>
							<p>{t.footer.phone}: <span className="text-[#1a1a1a] block mt-1">{t.footer.phoneValue}</span></p>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 uppercase tracking-widest">
					<p>&copy; {new Date().getFullYear()} {t.footer.supplementShop}. {t.footer.allRightsReserved}</p>
					<div className="flex gap-6">
						<span className="cursor-pointer hover:text-[#1a1a1a]">Privacy</span>
						<span className="cursor-pointer hover:text-[#1a1a1a]">Terms</span>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
