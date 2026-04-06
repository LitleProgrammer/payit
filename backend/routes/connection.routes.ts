import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { ConnectionService } from "../services/connection.service";

export function createConnectionRouter(connectionService: ConnectionService) {
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

            res.status(200).json({
                message: "Connections fetched successfully",
                data: connections
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    return router;
}