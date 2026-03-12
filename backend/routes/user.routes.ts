import { Router } from "express";
import { AuthService } from "../services/auth.service";

export function createUserRouter(authService: AuthService) {

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

    return router;
}