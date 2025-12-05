import React, { ReactNode } from "react";
import { useAuth } from "../features/auth/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "../shared/hooks/useTranslation";

interface ProtectedRouteProps {
	children: ReactNode;
	requireAdmin?: boolean;
}

/**
 * Protected Route Component
 * Wraps routes that require authentication (and optionally admin access)
 * Redirects to login if not authenticated, shows 403 if not admin
 */
export function ProtectedRoute({ 
	children, 
	requireAdmin = false 
}: ProtectedRouteProps): React.JSX.Element {
	const { isAuthenticated, isAdmin, loading } = useAuth();
	const navigate = useNavigate();
	const t = useTranslation();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			navigate({ to: "/session/login" });
		}
	}, [isAuthenticated, loading, navigate]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardContent className="pt-6">
						<div className="text-center">{t.common.loading}</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardHeader>
						<CardTitle>{t.protected.authRequired}</CardTitle>
						<CardDescription>
							{t.protected.pleaseLogin}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => navigate({ to: "/session/login" })}>
							{t.protected.goToLogin}
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (requireAdmin && !isAdmin) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-md mx-auto">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lock className="h-5 w-5" />
							{t.protected.accessDenied}
						</CardTitle>
						<CardDescription>
							{t.protected.adminRequired}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>{t.protected.forbidden}</AlertTitle>
							<AlertDescription>
								{t.protected.noPermission}
							</AlertDescription>
						</Alert>
						<div className="mt-4">
							<Button onClick={() => navigate({ to: "/" })} variant="outline">
								{t.protected.goHome}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return <>{children}</>;
}

