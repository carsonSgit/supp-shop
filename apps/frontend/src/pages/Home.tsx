import React from "react";
import { HeroSection } from "../components/HeroSection";
import { BentoFeatures } from "../components/BentoFeatures";
import { AnimatedProductList } from "../components/AnimatedProductList";

function Home(): React.JSX.Element {
	return (
		<div className="flex flex-col min-h-screen">
			<HeroSection />
			<BentoFeatures />
			<AnimatedProductList />
		</div>
	);
}

export default Home;
