import { ObjectId } from "mongodb";

export type UserRole = "user" | "admin";

export interface User {
	username: string;
	email: string;
	password: string;
	role?: UserRole; // Optional for backward compatibility, defaults to "user"
	_id?: ObjectId;
}

export interface Product {
	flavour: string;
	type: "Pre-workout" | "Protein-powder";
	price: number;
	description?: string;
	_id?: ObjectId;
}

export interface Order {
	orderId: string;
	price: number;
	_id?: ObjectId;
}

