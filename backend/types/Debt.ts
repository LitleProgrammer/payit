export interface Debt {
    _id?: string | ObjectId;
    amount: number;
    description: string;
    createdAt: Date;
    debtor: string;
    owner: string;
    currency: string;
    settled: boolean;
    settledAt?: Date;
}