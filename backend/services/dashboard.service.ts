import { DebtRepository } from "../repositories/debt.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { UserRepository } from "../repositories/user.repository";
import { ContactBalance } from "../types/ContactBalance";
import { DashboardSummary } from "../types/DashboardSummary";

export class DashboardService {
    constructor(
        private debtRepo: DebtRepository,
        private paymentRepo: PaymentRepository,
        private userRepo: UserRepository
    ) { }

    async getContactBalances(ownerId: string): Promise<ContactBalance[]> {
        const contacts = await this.userRepo.findDashboardContacts(ownerId);

        const result: ContactBalance[] = [];

        for (const contact of contacts) {
            const theyOweYouDebts = await this.debtRepo.findDebtsBetweenUsers(ownerId, contact._id);
            const youOweThemDebts = await this.debtRepo.findDebtsBetweenUsers(contact._id, ownerId);

            let theyOweYou = 0;
            let youOweThem = 0;

            for (const debt of theyOweYouDebts) {
                const paid = await this.paymentRepo.getPaidAmountForDebt(debt._id!.toString());
                theyOweYou += Math.max(0, debt.amount - paid);
            }

            for (const debt of youOweThemDebts) {
                const paid = await this.paymentRepo.getPaidAmountForDebt(debt._id!.toString());
                youOweThem += Math.max(0, debt.amount - paid);
            }

            result.push({
                _id: contact._id,
                username: contact.username,
                balance: theyOweYou - youOweThem,
                theyOweYou,
                youOweThem
            });
        }

        return result.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
    }

    async getDashboardSummary(ownerId: string): Promise<DashboardSummary> {
        const contactBalances = await this.getContactBalances(ownerId);

        let totalBalance = 0;
        let youOweTotal = 0;
        let youGetTotal = 0;
        let youOweCount = 0;
        let youGetCount = 0;

        for (const contact of contactBalances) {
            totalBalance += contact.balance;

            if (contact.balance < 0) {
                youOweTotal += Math.abs(contact.balance);
                youOweCount++;
            } else if (contact.balance > 0) {
                youGetTotal += contact.balance;
                youGetCount++;
            }
        }

        return {
            totalBalance,
            youOweTotal,
            youGetTotal,
            youOweCount,
            youGetCount
        };
    }
}