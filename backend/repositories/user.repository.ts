import { Collection, Db } from "mongodb";
import { User } from "../types/User";
import { ShadowUser } from "../types/ShadowUser";

export class UserRepository {

    private users: Collection<User>;
    private shadowUsers: Collection<ShadowUser>;

    constructor(db: Db) {
        this.users = db.collection<User>("users");
        this.shadowUsers = db.collection<ShadowUser>("shadowUsers");
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.users.findOne({ username });
    }

    async createUser(user: User): Promise<User> {
        const result = await this.users.insertOne(user);
        return {
            ...user,
            _id: result.insertedId.toString()
        };
    }

    async createShadowUser(user: ShadowUser): Promise<ShadowUser> {
        const result = await this.shadowUsers.insertOne(user);
        return {
            ...user,
            _id: result.insertedId.toString()
        };
    }

    async findShadowUsersByOwner(owner: string): Promise<ShadowUser[]> {
        return this.shadowUsers.find({ owner }).toArray();
    }
}