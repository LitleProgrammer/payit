// routes/debtRouter.ts
import { Router } from "express";
import { DebtRepository } from "../repositories/debt.repository";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { getDb } from "../db/mongoDB";

export function createDebtRouter(debtRepo: DebtRepository) {
    const router = Router();

    router.post("/create", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const { debtor, amount, currency, description } = req.body;

            if (!debtor || !amount || !currency) {
                return res.status(400).json({
                    error: "Missing required fields"
                });
            }

            if (typeof amount !== "number" || amount <= 0) {
                return res.status(400).json({
                    error: "Amount must be a positive number"
                });
            }

            const owner = req.user!.userId;

            const debt = await debtRepo.createDebt({
                owner,
                debtor,
                amount,
                currency,
                createdAt: new Date(),
                description,
                settled: false
            });

            const updatedDebts = await debtRepo.findDebtsByOwner(owner);

            res.status(201).json({
                message: "Debt created",
                data: {
                    debtId: debt._id,
                    updatedDebts
                }
            });

        } catch (err: any) {
            res.status(400).json({
                error: err.message
            });
        }
    });

    router.get(
        "/user/:id",
        authenticateToken,
        async (req: AuthRequest & { params: { id: string } }, res) => {
            try {
                const { id } = req.params;
                const owner = req.user!.userId;

                const debts = await debtRepo.findDebtsByUserID(owner, id);

                if (!debts) {
                    return res.status(404).json({
                        error: "Debts not found",
                    });
                }

                res.status(200).json({
                    message: "Debts found",
                    data: debts,
                });
            } catch (err: any) {
                res.status(400).json({
                    error: err.message,
                });
            }
        }
    );

    return router;
}