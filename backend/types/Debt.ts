export interface Debt {
    id: string;
    amount: number;
    description: string;
    createdAt: Date;
    debtor: string;
    creditor: string;
    settled: boolean;
    settledAt?: Date;
}