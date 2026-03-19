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
}