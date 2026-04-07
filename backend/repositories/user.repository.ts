import { Collection, Db, ObjectId } from "mongodb";
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
            _id: result.insertedId
        };
    }

    async createShadowUser(user: ShadowUser): Promise<ShadowUser> {
        const result = await this.shadowUsers.insertOne(user);
        return {
            ...user,
            _id: result.insertedId.toString()
        };
    }

    async findShadowUsersByOwnerId(owner: string): Promise<ShadowUser[]> {
        return this.shadowUsers.find({ owner }).toArray();
    }

    async findShadowUserById(shadowUserId: string): Promise<ShadowUser | null> {
        return this.shadowUsers.findOne({ _id: new ObjectId(shadowUserId) });
    }

    async findUserById(userId: string): Promise<User | null> {
        return this.users.findOne({ _id: new ObjectId(userId) });
    }

    async findAnyoneById(userId: string): Promise<User | ShadowUser | null> {
        var user: User | ShadowUser | null;
        user = await this.users.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            user = await this.shadowUsers.findOne({ _id: new ObjectId(userId) });
        }

        return user;
    }

    async linkShadowUser(shadowUserId: string, ownerId: string, realUserId: string): Promise<void> {
        await this.shadowUsers.updateOne(
            { _id: new ObjectId(shadowUserId), owner: ownerId },
            { $set: { connectedToUserId: realUserId, status: "connected" } }
        );
    }

    async findActiveShadowUsersByOwnerId(owner: string): Promise<ShadowUser[]> {
        return this.shadowUsers.find({ owner, status: "active" }).toArray();
    }

    async findLinkedShadowUser(owner: string, realUserId: string): Promise<ShadowUser | null> {
        return this.shadowUsers.findOne({ owner, connectedToUserId: realUserId });
    }
}