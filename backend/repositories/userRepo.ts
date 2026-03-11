import { getDb } from "../db/mongoDB";
import { User } from "../types/User";

export const getUsers = async () => {
    const db = getDb();
    return db.collection<User>("users").find().toArray();
};

export const createUser = async (user: User) => {
    const db = getDb();
    return db.collection<User>("users").insertOne(user);
};