import React from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

function MainLayout(): React.JSX.Element {
	return (
		<div className="flex min-h-screen flex-col">
			<ScrollToTop />
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
export default MainLayout;
