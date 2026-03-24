export interface PaymentAllocation {
    _id?: string;
    paymentId: string;
    debtId: string;
    amount: number;
}