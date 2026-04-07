export interface ConnectionCode {
    _id?: string;
    code: string;
    createdBy: string;
    createdAt: Date;
    expiresAt: Date;
    used: boolean;
}