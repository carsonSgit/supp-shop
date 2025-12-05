import React, { ReactNode } from "react";
import { ProtectedRoute } from "./ProtectedRoute";

interface ProtectedAdminRouteProps {
	children: ReactNode;
}

/**
 * Wrapper component for admin-only routes
 */
export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps): React.JSX.Element {
	return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}

