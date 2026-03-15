import { Router } from "express";
import { ShadowUser } from "../types/ShadowUser";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { UserRepository } from "../repositories/user.repository";
import { getDb } from "../db/mongoDB";

export function createShadowRouter() {
    const router = Router();
    const userRepo = new UserRepository(getDb());

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
            });

            res.status(201).json({
                message: "User created",
                shadowUserId: shadowUser._id
            });

        } catch (err: any) {

            res.status(400).json({
                error: err.message
            });

        }
    });

    router.get("/", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const shadowUsers = await userRepo.findShadowUsersByOwner(req.user!.userId);

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

    return router;
}