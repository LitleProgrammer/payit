export interface Payment {
    _id?: string;
    from: string;
    to: string;
    amount: number;
    currency: string;
    createdAt: Date;
}