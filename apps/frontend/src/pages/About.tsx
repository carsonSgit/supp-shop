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
		{ label: "Years Active", value: "10+", icon: <Leaf className="h-5 w-5" /> },
		{ label: "Happy Clients", value: "50k+", icon: <Heart className="h-5 w-5" /> },
		{ label: "Team Members", value: "25", icon: <Users className="h-5 w-5" /> },
		{ label: "Countries", value: "12", icon: <Globe className="h-5 w-5" /> },
	];

	const team = [
		{ name: "Noah", role: "Lead Developer", image: "https://i.pravatar.cc/150?u=noah", bio: "Fitness enthusiast and code wizard." },
		{ name: "Carson", role: "Content Strategist", image: "https://i.pravatar.cc/150?u=carson", bio: "The voice behind our brand's story." },
		{ name: "Alejandro", role: "Product Manager", image: "https://i.pravatar.cc/150?u=alejandro", bio: "Visionary leader with a passion for health." },
	];

	return (
		<div className="min-h-screen bg-background pb-20">
			{/* Hero Section */}
			<section className="relative py-24 bg-secondary/10 overflow-hidden">
				<div className="container relative z-10 text-center space-y-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">Our Story</Badge>
						<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground uppercase italic">
							Driven by <span className="text-primary">Passion</span>
						</h1>
						<p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
							We started with a simple mission: to provide the cleanest, most effective supplements on the planet.
						</p>
					</motion.div>
				</div>
				{/* Decorative background elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
					<div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
					<div className="absolute top-1/2 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl" />
				</div>
			</section>

			{/* Stats Grid */}
			<section className="container -mt-12 relative z-20 mb-24">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
						>
							<Card className="text-center hover:shadow-lg transition-shadow border-border/50">
								<CardContent className="pt-6">
									<div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
										{stat.icon}
									</div>
									<div className="text-3xl font-bold text-foreground">{stat.value}</div>
									<div className="text-sm text-muted-foreground">{stat.label}</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</section>

			{/* Team Section */}
			<section className="container">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold uppercase tracking-tight mb-4">Meet the Team</h2>
					<p className="text-muted-foreground max-w-xl mx-auto">
						The experts working behind the scenes to fuel your journey.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{team.map((member, index) => (
						<motion.div
							key={member.name}
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.2 }}
						>
							<Card className="overflow-hidden border-none shadow-none bg-transparent text-center group">
								<div className="relative mx-auto w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-300">
									<img
										src={member.image}
										alt={member.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<h3 className="text-xl font-bold text-foreground">{member.name}</h3>
								<p className="text-primary font-medium mb-2">{member.role}</p>
								<p className="text-muted-foreground text-sm">{member.bio}</p>
							</Card>
						</motion.div>
					))}
				</div>
			</section>
		</div>
	);
}

export default About;
