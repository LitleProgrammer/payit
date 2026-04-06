import { Router } from "express";
import { ShadowUser } from "../types/ShadowUser";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { UserRepository } from "../repositories/user.repository";
import { getDb } from "../db/mongoDB";
import { DebtRepository } from "../repositories/debt.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { ConnectionService } from "../services/connection.service";

export function createShadowRouter(
    userRepo: UserRepository,
    debtRepo: DebtRepository,
    paymentRepo: PaymentRepository,
    connectionService: ConnectionService
) {
    const router = Router();

    router.post("/create", authenticateToken, async (req: AuthRequest, res) => {
        try {

            const { username } = req.body;

            if (!username) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const owner = req.user!.userId;

            const shadowUser = await userRepo.createShadowUser({
                username,
                createdAt: new Date(),
                owner,
                status: "active",
                connectedToUserId: null
            });

            const shadowUsers = await userRepo.findShadowUsersByOwnerId(req.user!.userId);

            res.status(201).json({
                message: "User created",
                data: {
                    shadowUserId: shadowUser._id,
                    updatedShadowUsers: shadowUsers
                }
            });

        } catch (err: any) {

            res.status(400).json({
                error: err.message
            });

        }
    });

    router.get("/", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const shadowUsers = await userRepo.findShadowUsersByOwnerId(req.user!.userId);

            res.status(200).json({
                message: "success",
                data: shadowUsers
            });

        } catch (err: any) {

            res.status(400).json({
                error: err.message
            });

        }
    });

    router.get("/:shadowUserId", authenticateToken, async (req: AuthRequest & { params: { shadowUserId: string } }, res) => {
        try {
            const { shadowUserId } = req.params;

            const shadowUser = await userRepo.findShadowUserById(shadowUserId);

            res.status(200).json({
                message: "success",
                data: shadowUser
            });

        } catch (err: any) {

            res.status(400).json({
                error: err.message
            });

        }
    });

    router.post("/:shadowUserId/link", authenticateToken, async (req: AuthRequest & { params: { shadowUserId: string } }, res) => {
        try {
            const { shadowUserId } = req.params;
            const { realUserId } = req.body;
            const ownerId = req.user!.userId;

            if (!realUserId) {
                return res.status(400).json({
                    error: "Missing realUserId"
                });
            }

            const shadowUser = await userRepo.findShadowUserById(shadowUserId);

            if (!shadowUser) {
                return res.status(404).json({
                    error: "Shadow user not found"
                });
            }

            if (shadowUser.owner !== ownerId) {
                return res.status(403).json({
                    error: "You do not own this shadow user"
                });
            }

            if (shadowUser.status !== "active") {
                return res.status(400).json({
                    error: "Shadow user is already connected"
                });
            }

            const realUser = await userRepo.findUserById(realUserId);

            if (!realUser) {
                return res.status(404).json({
                    error: "Real user not found"
                });
            }

            if (realUserId === ownerId) {
                return res.status(400).json({
                    error: "You cannot link a shadow user to yourself"
                });
            }

            const connected = await connectionService.areUsersConnected(ownerId, realUserId);

            if (!connected) {
                return res.status(400).json({
                    error: "You are not connected to this user"
                });
            }

            const existingLinkedShadow = await userRepo.findLinkedShadowUser(ownerId, realUserId);

            if (existingLinkedShadow) {
                return res.status(400).json({
                    error: "You already linked another shadow user to this real user"
                });
            }

            await debtRepo.reassignDebtor(shadowUserId, realUserId, ownerId);
            await paymentRepo.reassignPaymentParticipant(shadowUserId, realUserId);
            await userRepo.linkShadowUser(shadowUserId, ownerId, realUserId);

            const shadowUsers = await userRepo.findShadowUsersByOwnerId(ownerId);

            res.status(200).json({
                message: "Shadow user linked successfully",
                data: {
                    shadowUserId,
                    realUserId,
                    updatedShadowUsers: shadowUsers
                }
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    return router;
}