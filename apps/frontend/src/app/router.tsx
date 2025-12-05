/**
 * TanStack Router Configuration
 */

import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';
import React from 'react';
import { Toaster } from '../components/ui/toaster';

// Import layouts
import MainLayout from '../layouts/MainLayout';

// Import pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import UserList from '../pages/UserList';
import UserDelete from '../pages/UserDelete';
import UserCreate from '../pages/UserCreate';
import UserUpdate from '../pages/UserUpdate';
import Orders from '../pages/Orders';
import NewOrder from '../pages/NewOrder';
import GetOrder from '../pages/GetOrder';
import GetAll from '../pages/GetAll';
import UpdateOrder from '../pages/UpdateOrder';
import DeleteOrder from '../pages/DeleteOrder';
import Products from '../pages/Products';
import GetSingleProduct from '../pages/GetSingleProduct';
import NewProduct from '../pages/NewProduct';
import GetAllProducts from '../pages/GetAllProducts';
import UpdateProducts from '../pages/UpdateProducts';
import DeleteProduct from '../pages/DeleteProduct';
import { Login } from '../components/Login';

// Create root route
const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

// Create layout route with outlet
const layoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: 'layout',
	component: () => <MainLayout />,
});

// Create index route
const indexRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/',
	component: Home,
});

// Create all routes
const aboutRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/about',
	component: About,
});

const contactRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/contact',
	component: Contact,
});

const userListRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/userlist',
	component: UserList,
});

const userDeleteRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/userdelete',
	component: UserDelete,
});

const userCreateRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/usercreate',
	component: UserCreate,
});

const userUpdateRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/userupdate',
	component: UserUpdate,
});

const ordersRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/orders',
	component: Orders,
});

const addOrderRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/add',
	component: NewOrder,
});

const getOneOrderRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/getone',
	component: GetOrder,
});

const getAllOrdersRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/getall',
	component: GetAll,
});

const updateOrderRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/update',
	component: UpdateOrder,
});

const deleteOrderRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/delete',
	component: DeleteOrder,
});

const productsRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/products',
	component: Products,
});

const getProductRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/getProduct',
	component: GetSingleProduct,
});

const productsAddRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/productsAdd',
	component: NewProduct,
});

const getProductsRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/getProducts',
	component: GetAllProducts,
});

const productsUpdateRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/productsUpdate',
	component: UpdateProducts,
});

const productsDeleteRoute = createRoute({
	getParentRoute: () => layoutRoute,
	path: '/productsDelete',
	component: DeleteProduct,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/session/login',
	component: Login,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
	layoutRoute.addChildren([
		indexRoute,
		aboutRoute,
		contactRoute,
		userListRoute,
		userDeleteRoute,
		userCreateRoute,
		userUpdateRoute,
		ordersRoute,
		addOrderRoute,
		getOneOrderRoute,
		getAllOrdersRoute,
		updateOrderRoute,
		deleteOrderRoute,
		productsRoute,
		getProductRoute,
		productsAddRoute,
		getProductsRoute,
		productsUpdateRoute,
		productsDeleteRoute,
	]),
	loginRoute,
]);

// Create the router
const router = createRouter({ routeTree });

// Create QueryClient
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				// Don't retry on 4xx errors (client errors)
				if (error && typeof error === 'object' && 'status' in error) {
					const status = (error as { status: number }).status;
					if (status >= 400 && status < 500) {
						return false;
					}
				}
				// Retry up to 2 times for network errors
				return failureCount < 2;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
});

// Router component
export function AppRouter() {
	return (
		<CookiesProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster />
			</QueryClientProvider>
		</CookiesProvider>
	);
}

// Export router for use in components
export { router };

