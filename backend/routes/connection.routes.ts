import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { ConnectionService } from "../services/connection.service";
import { UserRepository } from "../repositories/user.repository";
import { Contact } from "../types/Contact";

export function createConnectionRouter(connectionService: ConnectionService, userRepo: UserRepository) {
    const router = Router();

    router.post("/code", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const userId = req.user!.userId;

            const codeDoc = await connectionService.createConnectionCode(userId);

            res.status(201).json({
                message: "Connection code created",
                data: {
                    code: codeDoc.code,
                    expiresAt: codeDoc.expiresAt
                }
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    router.post("/code/redeem", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const { code } = req.body;
            const userId = req.user!.userId;

            if (!code) {
                return res.status(400).json({
                    error: "Missing code"
                });
            }

            const connection = await connectionService.redeemConnectionCode(code, userId);

            res.status(201).json({
                message: "Users connected successfully",
                data: connection
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    router.get("/", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const userId = req.user!.userId;

            const connections = await connectionService.getConnections(userId);

            if (connections.length === 0) {
                return res.status(200).json({
                    message: "No connections found"
                });
            }

            const users: Contact[] = [];

            for (const connection of connections) {
                if (connection.userA === userId) {
                    var user = await userRepo.findUserById(connection.userB);
                    if (!user) {
                        continue;
                    }

                    users.push({ _id: connection.userB, username: user.username });
                } else {
                    var user = await userRepo.findUserById(connection.userA);
                    if (!user) {
                        continue;
                    }

                    users.push({ _id: connection.userA, username: user.username });
                }
            }

            res.status(200).json({
                message: "Connections fetched successfully",
                data: users
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    return router;
}