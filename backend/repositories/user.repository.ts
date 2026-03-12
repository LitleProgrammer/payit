import { Collection, Db } from "mongodb";
import { User } from "../types/User";

export class UserRepository {

    private collection: Collection<User>;

    constructor(db: Db) {
        this.collection = db.collection<User>("users");
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.collection.findOne({ username });
    }

    async createUser(user: User): Promise<User> {
        const result = await this.collection.insertOne(user);
        return {
            ...user,
            _id: result.insertedId.toString()
        };
    }
}