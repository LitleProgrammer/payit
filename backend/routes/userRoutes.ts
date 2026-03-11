import { Router } from "express";
import { getUsers, createUser } from "../repositories/userRepo";

const router = Router();

router.get("/", async (req, res) => {
    const users = await getUsers();
    res.json(users);
});

router.post("/", async (req, res) => {
    const result = await createUser(req.body);
    res.json(result);
});

export default router;