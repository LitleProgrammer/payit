// services/payment.service.ts
import { DebtRepository } from "../repositories/debt.repository";
import { PaymentRepository } from "../repositories/payment.repository";

export class PaymentService {

    constructor(
        private debtRepo: DebtRepository,
        private paymentRepo: PaymentRepository
    ) { }

    async autoAllocate(from: string, to: string, amount: number) {
        const debts = await this.debtRepo.findDebtsBetweenUsers(to, from);

        console.log("Found following debts: ", debts);

        let remaining = amount;
        const allocations: { debtId: string; amount: number }[] = [];

        for (const debt of debts) {
            const paid = await this.paymentRepo.getPaidAmountForDebt(debt._id!.toString());
            const remainingDebt = debt.amount - paid;

            if (remainingDebt <= 0) continue;

            const applied = Math.min(remainingDebt, remaining);

            console.log("Applied subtract: ", applied);


            allocations.push({
                debtId: debt._id!.toString(),
                amount: applied
            });

            remaining -= applied;

            if (remaining <= 0) break;
        }

        return allocations;
    }
}