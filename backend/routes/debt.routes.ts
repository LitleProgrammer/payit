// routes/debtRouter.ts
import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { DebtService } from "../services/debt.service";
import { DebtRepository } from "../repositories/debt.repository";

export function createDebtRouter(
    debtService: DebtService,
    debtRepo: DebtRepository
) {
    const router = Router();

    router.post("/create", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const { debtor, amount, currency, description } = req.body;

            const owner = req.user!.userId;

            const debt = await debtRepo.createDebt({
                owner,
                debtor,
                amount,
                currency,
                createdAt: new Date(),
                description,
            });

            const updatedDebts = await debtService.getDebtsWithRemaining(owner, debtor);

            res.status(201).json({
                message: "Debt created",
                data: {
                    debtId: debt._id,
                    updatedDebts
                }
            });

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    router.get("/user/:id", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const owner = req.user!.userId;
            const { id } = req.params;

            const debts = await debtService.getDebtsWithRemaining(owner, id.toString());

            res.status(200).json({
                message: "Debts found",
                data: debts
            });

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    router.post("/edit/:id", authenticateToken, async (req: AuthRequest & { params: { id: string } }, res) => {
        try {
            const { id } = req.params;
            const owner = req.user!.userId;
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

            const updatedDebts = await debtRepo.updateDebt(id, {
                amount,
                currency,
                description
            }, owner);

            if (!updatedDebts) {
                return res.status(404).json({
                    error: "Debt not found",
                });
            }

            const updatedDebtsWithRemaining = await debtService.getDebtsWithRemaining(owner, debtor);

            res.status(200).json({
                message: "Debt updated",
                data: updatedDebtsWithRemaining,
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message,
            });
        }
    });

    router.delete("/delete/:id", authenticateToken, async (req: AuthRequest & { params: { id: string } }, res) => {
        try {
            const { id } = req.params;
            const owner = req.user!.userId;

            console.log("Delete debt: ", id, owner);


            const updatedDebts = await debtRepo.deleteDebt(id, owner);

            if (!updatedDebts) {
                return res.status(404).json({
                    error: "Debt not found",
                });
            }

            var updatedDebtsWithRemaining = [];

            if (updatedDebts && updatedDebts.length > 0) {
                const debtorId = updatedDebts[0].debtor;
                updatedDebtsWithRemaining = await debtService.getDebtsWithRemaining(owner, debtorId);
            }

            res.status(200).json({
                message: "Debt deleted",
                data: updatedDebts
            });
        } catch (err: any) {
            res.status(400).json({
                error: err.message,
            });
        }
    });

    return router;
}