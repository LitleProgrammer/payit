import { ObjectId } from "mongodb";

export interface User {
    _id?: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
}