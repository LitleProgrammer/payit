import { Collection, Db } from "mongodb";
import { ConnectionCode } from "../types/ConnectionCode";
import { UserConnection } from "../types/UserConnection";

export class ConnectionRepository {
    private connectionCodes: Collection<ConnectionCode>;
    private userConnections: Collection<UserConnection>;

    constructor(db: Db) {
        this.connectionCodes = db.collection<ConnectionCode>("connectionCodes");
        this.userConnections = db.collection<UserConnection>("userConnections");
    }

    async createCode(codeDoc: ConnectionCode): Promise<ConnectionCode> {
        const result = await this.connectionCodes.insertOne(codeDoc);

        return {
            ...codeDoc,
            _id: result.insertedId.toString()
        };
    }

    async findValidCode(code: string): Promise<ConnectionCode | null> {
        return this.connectionCodes.findOne({
            code,
            used: false,
            expiresAt: { $gt: new Date() }
        });
    }

    async markCodeAsUsed(code: string): Promise<void> {
        await this.connectionCodes.updateOne(
            { code },
            { $set: { used: true } }
        );
    }

    async createConnection(userA: string, userB: string): Promise<UserConnection> {
        const [sortedA, sortedB] = [userA, userB].sort();

        const connection: UserConnection = {
            userA: sortedA,
            userB: sortedB,
            createdAt: new Date()
        };

        const result = await this.userConnections.insertOne(connection);

        return {
            ...connection,
            _id: result.insertedId.toString()
        };
    }

    async areUsersConnected(userA: string, userB: string): Promise<boolean> {
        const [sortedA, sortedB] = [userA, userB].sort();

        const connection = await this.userConnections.findOne({
            userA: sortedA,
            userB: sortedB
        });

        return !!connection;
    }

    async getConnectionsForUser(userId: string): Promise<UserConnection[]> {
        return this.userConnections.find({
            $or: [
                { userA: userId },
                { userB: userId }
            ]
        }).toArray();
    }
}