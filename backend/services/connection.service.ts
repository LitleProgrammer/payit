import { ConnectionRepository } from "../repositories/connection.repository";

export class ConnectionService {
    constructor(private connectionRepo: ConnectionRepository) { }

    async createConnectionCode(userId: string) {
        const code = await this.generateUniqueCode();

        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000); // 5 minutes

        return this.connectionRepo.createCode({
            code,
            createdBy: userId,
            createdAt,
            expiresAt,
            used: false
        });
    }

    async redeemConnectionCode(code: string, currentUserId: string) {
        const codeDoc = await this.connectionRepo.findValidCode(code);

        if (!codeDoc) {
            throw new Error("Invalid or expired code");
        }

        if (codeDoc.createdBy === currentUserId) {
            throw new Error("You cannot redeem your own code");
        }

        const alreadyConnected = await this.connectionRepo.areUsersConnected(
            codeDoc.createdBy,
            currentUserId
        );

        if (alreadyConnected) {
            throw new Error("Users are already connected");
        }

        const connection = await this.connectionRepo.createConnection(
            codeDoc.createdBy,
            currentUserId
        );

        await this.connectionRepo.markCodeAsUsed(code);

        return connection;
    }

    async getConnections(userId: string) {
        return this.connectionRepo.getConnectionsForUser(userId);
    }

    async areUsersConnected(userA: string, userB: string) {
        return this.connectionRepo.areUsersConnected(userA, userB);
    }

    private async generateUniqueCode(): Promise<string> {
        for (let i = 0; i < 10; i++) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            const existing = await this.connectionRepo.findValidCode(code);
            if (!existing) {
                return code;
            }
        }

        throw new Error("Could not generate a unique connection code");
    }
}