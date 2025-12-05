import React from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
	return (
		<div>
			<Header />
			<Outlet />
			<Footer />
		</div>
	);
}
export default MainLayout;
