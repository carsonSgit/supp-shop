import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../../../api/auth";
import { usersApi } from "../../../api/users";
import { User } from "../../../api/types";
import { useNavigate } from "@tanstack/react-router";

interface AuthContextType {
	isAuthenticated: boolean;
	isAdmin: boolean;
	user: User | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

/**
 * Auth Context Provider
 * Manages authentication state and user session
 */
export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const navigate = useNavigate();

	/**
	 * Check authentication status by attempting to access an admin endpoint
	 * If 401, user is not authenticated; if 403, user is authenticated but not admin
	 */
	const checkAuth = async (): Promise<void> => {
		try {
			setLoading(true);
			// Try to access an admin endpoint to check auth status
			// This will tell us: 401 = not authenticated, 403 = authenticated but not admin, 200 = admin
			try {
				await usersApi.getAll(); // Admin-only endpoint
				// If we get here, user is authenticated and is admin
				setIsAuthenticated(true);
				setIsAdmin(true);
			} catch (error: unknown) {
				// Check error status
				if (error && typeof error === 'object' && 'status' in error) {
					const status = (error as { status: number }).status;
					if (status === 401) {
						// Not authenticated
						setIsAuthenticated(false);
						setIsAdmin(false);
						setUser(null);
					} else if (status === 403) {
						// Authenticated but not admin
						setIsAuthenticated(true);
						setIsAdmin(false);
					} else {
						// Other error, assume not authenticated
						setIsAuthenticated(false);
						setIsAdmin(false);
						setUser(null);
					}
				} else {
					// Unknown error, assume not authenticated
					setIsAuthenticated(false);
					setIsAdmin(false);
					setUser(null);
				}
			}
		} catch (error) {
			// Fallback: assume not authenticated
			setIsAuthenticated(false);
			setIsAdmin(false);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Login user and determine admin status by attempting admin endpoint
	 */
	const login = async (username: string, password: string): Promise<void> => {
		try {
			setLoading(true);
			await authApi.login({ username, password });
			
			// Set basic user info
			setUser({ username, email: "" });
			setIsAuthenticated(true);
			
			// Check if user is admin by attempting to access an admin-only endpoint
			// If it succeeds, user is admin; if 403, user is not admin
			try {
				await usersApi.getAll(); // Admin-only endpoint
				setIsAdmin(true);
			} catch (error: unknown) {
				// If 403, user is authenticated but not admin
				if (error && typeof error === 'object' && 'status' in error) {
					const status = (error as { status: number }).status;
					if (status === 403) {
						setIsAdmin(false);
					} else {
						// Other error, assume not admin for safety
						setIsAdmin(false);
					}
				} else {
					setIsAdmin(false);
				}
			}
		} catch (error) {
			setIsAuthenticated(false);
			setIsAdmin(false);
			setUser(null);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Logout user
	 */
	const logout = async (): Promise<void> => {
		try {
			await authApi.logout();
		} catch (error) {
			// Even if logout fails, clear local state
			console.error("Logout error:", error);
		} finally {
			setIsAuthenticated(false);
			setIsAdmin(false);
			setUser(null);
			navigate({ to: "/" });
		}
	};

	// Check auth status on mount
	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isAdmin,
				user,
				login,
				logout,
				checkAuth,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

/**
 * Hook to use auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

