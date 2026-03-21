// repositories/DebtRepository.ts
import { Collection, Db } from "mongodb";
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

    async deleteDebt(debtID: string): Promise<boolean> {
        await this.debts.deleteOne({ _id: debtID });

        return true;
    }

    async updateDebt(debtID: string, updatedDebt: Partial<Debt>): Promise<Debt | null> {
        const result = await this.debts.findOneAndUpdate(
            { _id: debtID },
            { $set: updatedDebt },
            { returnDocument: "after" }
        );

        return result;
    }
}