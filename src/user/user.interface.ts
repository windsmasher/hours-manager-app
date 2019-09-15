import { Document } from "mongoose";

export interface IUser {
    login: string;
    password: string;
    isAdmin: boolean;
}

export interface IUserModel extends Document {
    login: string;
    password: string;
    isAdmin: boolean;
}