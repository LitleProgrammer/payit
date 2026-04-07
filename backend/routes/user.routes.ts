import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { authenticateToken } from "../middleware/auth.middleware";

export function createUserRouter(authService: AuthService, userRepo: UserRepository) {
    const router = Router();

    router.post("/signup", async (req, res) => {
        try {

            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const user = await authService.signup(username, password);

            res.status(201).json({
                message: "User created",
                userId: user._id
            });

        } catch (err: any) {

            res.status(400).json({
                error: err.message
            });

        }
    });

    router.post("/login", async (req, res) => {
        try {

            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const result = await authService.login(username, password);

            res.json(result);

        } catch (err: any) {

            res.status(401).json({
                error: err.message
            });

        }
    });

    router.get("/anyone/:userId", authenticateToken, async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await userRepo.findAnyoneById(userId.toString());

            res.json({
                message: "User found",
                data: user
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    return router;
}