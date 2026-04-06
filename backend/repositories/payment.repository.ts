import { Collection, Db, ObjectId } from "mongodb";
import { Payment } from "../types/Payment";
import { PaymentAllocation } from "../types/PaymentAllocation";

export class PaymentRepository {

    private payments: Collection<Payment>;
    private allocations: Collection<PaymentAllocation>;

    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Constructor for PaymentRepository.
     * @param {Db} db - The MongoDB database object.
     */
    /*******  d7415b09-783d-41bf-a72e-4acb091ef880  *******/
    constructor(db: Db) {
        this.payments = db.collection<Payment>("payments");
        this.allocations = db.collection<PaymentAllocation>("payment_allocations");
    }

    async createPaymentWithAllocations(
        payment: Payment,
        allocations: { debtId: string; amount: number }[]
    ) {
        const paymentResult = await this.payments.insertOne(payment);

        const paymentId = paymentResult.insertedId.toString();

        const allocationDocs = allocations.map(a => ({
            paymentId,
            debtId: a.debtId,
            amount: a.amount
        }));

        if (allocationDocs.length > 0) {
            await this.allocations.insertMany(allocationDocs);
        }

        return {
            ...payment,
            _id: paymentId
        };
    }

    async getPaidAmountForDebt(debtId: string): Promise<number> {
        const result = await this.allocations.aggregate([
            { $match: { debtId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]).toArray();

        return result[0]?.total || 0;
    }

    async getRemainingForDebt(debtId: string, originalAmount: number): Promise<number> {
        const paid = await this.getPaidAmountForDebt(debtId);
        return originalAmount - paid;
    }

    async reassignPaymentParticipant(oldUserId: string, newUserId: string): Promise<void> {
        await this.payments.updateMany(
            { from: oldUserId },
            { $set: { from: newUserId } }
        );

        await this.payments.updateMany(
            { to: oldUserId },
            { $set: { to: newUserId } }
        );
    }
}