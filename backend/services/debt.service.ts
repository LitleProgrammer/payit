// services/debt.service.ts
import { DebtRepository } from "../repositories/debt.repository";
import { PaymentRepository } from "../repositories/payment.repository";

export class DebtService {
    constructor(
        private debtRepo: DebtRepository,
        private paymentRepo: PaymentRepository
    ) { }

    async getDebtsWithRemaining(owner: string, userId: string) {
        const debts = await this.debtRepo.findDebtsByUserID(owner, userId);

        return Promise.all(
            debts.map(async (debt) => {
                const paid = await this.paymentRepo.getPaidAmountForDebt(debt._id!.toString());

                return {
                    ...debt,
                    paid,
                    remaining: debt.amount - paid
                };
            })
        );
    }

    async getDebtsYouOweToUser(currentUserId: string, otherUserId: string) {
        const debts = await this.debtRepo.findDebtsBetweenUsers(otherUserId, currentUserId);

        return Promise.all(
            debts.map(async (debt) => {
                const paid = await this.paymentRepo.getPaidAmountForDebt(debt._id!.toString());

                return {
                    ...debt,
                    paid,
                    remaining: debt.amount - paid
                };
            })
        );
    }
}