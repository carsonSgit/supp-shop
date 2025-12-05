/**
 * Shared component prop types
 */

import { ReactNode } from "react";
import { User, Product, Order } from "../../api/types";

/**
 * Props for NavButton component
 */
export interface NavButtonProps {
	to?: string;
	label: string;
}

/**
 * Props for Card component
 */
export interface CardProps {
	children: ReactNode;
}

/**
 * Props for DisplayUser component
 */
export interface DisplayUserProps {
	user: User;
	heading: string;
}

/**
 * Props for DisplayProduct component
 */
export interface DisplayProductProps {
	product: Product;
	heading: string;
}

/**
 * Props for DisplayOrder component
 */
export interface DisplayOrderProps {
	order: Order;
	heading: string;
}

/**
 * Props for form components that set added items
 */
export interface FormWithSetAddedProps<T> {
	setAdded: (item: T) => void;
}

/**
 * Props for form components that set updated items
 */
export interface FormWithSetUpdatedProps<T> {
	setUpdated: (item: T) => void;
}

/**
 * Props for form components that set deleted items
 */
export interface FormWithSetDeletedProps<T> {
	setDeleted: (item: T) => void;
}

/**
 * Props for form components that set fetched items
 */
export interface FormWithSetFetchedProps<T> {
	setFetched: (item: T) => void;
}

/**
 * Props for list components
 */
export interface ListProps<T> {
	items: T[];
	heading?: string;
}

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
	children: ReactNode;
}

/**
 * ErrorBoundary state
 */
export interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: React.ErrorInfo | null;
}

