import React from "react";
import { useTranslation } from "../shared/hooks/useTranslation";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Leaf, Heart, Users, Globe } from "lucide-react";

function About(): React.JSX.Element {
	const t = useTranslation();

	const stats = [
		{ label: "Years Active", value: "10+", icon: <Leaf className="h-6 w-6" /> },
		{ label: "Happy Clients", value: "50k+", icon: <Heart className="h-6 w-6" /> },
		{ label: "Team Members", value: "25", icon: <Users className="h-6 w-6" /> },
		{ label: "Countries", value: "12", icon: <Globe className="h-6 w-6" /> },
	];

	const team = [
		{ name: "Noah", role: "Lead Developer", image: "https://i.pravatar.cc/150?u=noah", bio: "Fitness enthusiast and code wizard." },
		{ name: "Carson", role: "Content Strategist", image: "https://i.pravatar.cc/150?u=carson", bio: "The voice behind our brand's story." },
		{ name: "Alejandro", role: "Product Manager", image: "https://i.pravatar.cc/150?u=alejandro", bio: "Visionary leader with a passion for health." },
	];

	return (
		<div className="min-h-screen bg-white pb-24">
			{/* Hero Section */}
			<section className="relative py-32 bg-[#fafafa] overflow-hidden">
				<div className="container relative z-10 text-center space-y-8">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 text-sm font-medium text-gray-500 mb-6 shadow-sm">
							<span className="h-2 w-2 rounded-full bg-lime-500" />
							Our Story
						</div>
						<h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-[#1a1a1a]">
							Driven by <span className="text-lime-500 italic">Passion</span>
						</h1>
						<p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
							We started with a simple mission: to provide the cleanest, most effective supplements on the planet.
						</p>
					</motion.div>
				</div>

				{/* Abstract Shapes */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
					<div className="absolute -top-24 -left-24 w-96 h-96 bg-lime-200/50 rounded-full blur-3xl mix-blend-multiply" />
					<div className="absolute top-1/2 right-0 w-80 h-80 bg-green-200/50 rounded-full blur-3xl mix-blend-multiply" />
				</div>
			</section>

			{/* Stats Grid */}
			<section className="container transform -translate-y-16 relative z-20">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
						>
							<div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 text-center group hover:-translate-y-2 transition-transform duration-300">
								<div className="mx-auto w-14 h-14 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
									{stat.icon}
								</div>
								<div className="text-4xl font-serif font-bold text-[#1a1a1a] mb-1">{stat.value}</div>
								<div className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
							</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Team Section */}
			<section className="container py-16">
				<div className="text-center mb-20 space-y-4">
					<h2 className="text-4xl font-serif font-bold text-[#1a1a1a]">Meet the Team</h2>
					<p className="text-gray-500 max-w-xl mx-auto text-lg">
						The experts working behind the scenes to fuel your journey.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
					{team.map((member, index) => (
						<motion.div
							key={member.name}
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.2 }}
							className="group"
						>
							<div className="relative mb-6">
								<div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100">
									<img
										src={member.image}
										alt={member.name}
										className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
									/>
								</div>
								<div className="absolute -bottom-6 right-6 bg-white p-4 rounded-2xl shadow-lg max-w-[200px]">
									<p className="text-sm text-gray-600 italic leading-snug">"{member.bio}"</p>
								</div>
							</div>
							<div className="pl-4">
								<h3 className="text-2xl font-serif font-bold text-[#1a1a1a] group-hover:text-lime-600 transition-colors">{member.name}</h3>
								<p className="text-lime-600 font-medium font-mono">{member.role}</p>
							</div>
						</motion.div>
					))}
				</div>
			</section>
		</div>
	);
}

export default About;
