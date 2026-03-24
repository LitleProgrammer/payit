// repositories/DebtRepository.ts
import { Collection, Db, ObjectId } from "mongodb";
import { Debt } from "../types/Debt";

export class DebtRepository {

    private debts: Collection<Debt>;

    constructor(db: Db) {
        this.debts = db.collection<Debt>("debts");
    }

    async createDebt(debt: Debt): Promise<Debt> {
        const result = await this.debts.insertOne(debt);

        return {
            ...debt,
            _id: result.insertedId.toString()
        };
    }

    async findDebtsByOwner(owner: string): Promise<Debt[]> {
        return this.debts.find({ owner }).toArray();
    }

    async findDebtsByUserID(owner: string, userID: string): Promise<Debt[]> {
        return this.debts.find({ debtor: userID, owner }).toArray();
    }

    async deleteDebt(debtID: string, ownerID: string): Promise<Debt[]> {
        await this.debts.deleteOne({ _id: new ObjectId(debtID!), owner: ownerID });

        const updated = await this.debts.find({ owner: ownerID }).toArray();
        return updated;
    }

    async updateDebt(debtID: string, updatedDebt: Partial<Debt>, ownerID: string): Promise<Debt[] | null> {
        await this.debts.updateOne(
            { _id: new ObjectId(debtID!), owner: ownerID },
            { $set: updatedDebt },
        );

        const updated = await this.debts.find({ owner: ownerID }).toArray();

        return updated;
    }

    async findDebtsBetweenUsers(owner: string, debtor: string): Promise<Debt[]> {
        return await this.debts
            .find({ owner, debtor })
            .sort({ createdAt: 1 }) // oldest first
            .toArray();
    }

    async findById(debtId: string): Promise<Debt | null> {
        if (!ObjectId.isValid(debtId)) return null;

        return this.debts.findOne({
            _id: new ObjectId(debtId)
        });
    }
}