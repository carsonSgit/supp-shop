import { render, screen } from "@testing-library/react";
import { AppRouter, router } from "./app/router";

afterEach(() => {
	// Reset router to the root route between tests
	window.history.pushState({}, "", "/");
});

test("renders home route hero copy", async () => {
	render(<AppRouter />);
	expect(await screen.findByText(/Supplements/i)).toBeInTheDocument();
});

test("navigates to login route", async () => {
	render(<AppRouter />);
	await router.navigate({ to: "/session/login" });
	expect(await screen.findByText(/Login/i)).toBeInTheDocument();
});
