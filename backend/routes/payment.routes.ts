// routes/paymentRouter.ts
import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { PaymentRepository } from "../repositories/payment.repository";
import { DebtRepository } from "../repositories/debt.repository";
import { PaymentService } from "../services/payment.service";
import { DebtService } from "../services/debt.service";

export function createPaymentRouter(
    paymentRepo: PaymentRepository,
    debtRepo: DebtRepository,
    paymentService: PaymentService,
    debtService: DebtService
) {
    const router = Router();

    // ✅ AUTO PAYMENT
    router.post("/pay", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const { to, amount, currency } = req.body;
            const from = req.user!.userId;

            const allocations = await paymentService.autoAllocate(to, from, amount);

            const payment = await paymentRepo.createPaymentWithAllocations(
                { from, to, amount, currency, createdAt: new Date() },
                allocations
            );

            const updatedDebts = await debtService.getDebtsWithRemaining(from, to);

            res.status(201).json({
                message: "Payment created",
                data: {
                    payment,
                    allocations,
                    updatedDebts
                }
            });

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    // ✅ PAY SPECIFIC DEBT
    router.post("/pay/debt/:debtId", authenticateToken, async (req: AuthRequest, res) => {
        try {
            const { debtId } = req.params;
            const { amount, currency } = req.body;
            const from = req.user!.userId;

            const debt = await debtRepo.findById(debtId.toString());
            if (!debt) return res.status(404).json({ error: "Debt not found" });

            const remaining = await paymentRepo.getRemainingForDebt(debtId.toString(), debt.amount);
            if (amount > remaining) {
                return res.status(400).json({
                    error: `Amount exceeds remaining debt (${remaining})`
                });
            }

            const payment = await paymentRepo.createPaymentWithAllocations(
                { from, to: debt.debtor, amount, currency, createdAt: new Date() },
                [{ debtId: debtId.toString(), amount }]
            );

            const updatedDebts = await debtService.getDebtsWithRemaining(from, debt.debtor);

            res.status(201).json({
                message: "Debt payment recorded",
                data: {
                    payment,
                    updatedDebts
                }
            });

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
}