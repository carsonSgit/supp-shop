import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { User, Product, Order } from "./models.types";

export interface DatabaseCollections {
	usersCollection: Collection<User> | null;
	productsCollection: Collection<Product> | null;
	ordersCollection: Collection<Order> | null;
}

export type { MongoClient, Db, Collection, ObjectId };

