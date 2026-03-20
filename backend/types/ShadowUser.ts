import { ObjectId } from "mongodb";

export interface ShadowUser {
    _id?: string | ObjectId;
    username: string;
    createdAt: Date;
    owner: string; //The userId of the user that created the shadow user
}