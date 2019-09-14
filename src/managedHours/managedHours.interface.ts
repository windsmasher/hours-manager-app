import { Document } from "mongoose";

export interface IManagedHours {
    userId: string;
    status: number;
    date: Date;
    hour: number;
    title?: string;
}

export interface IManagedHoursModel extends Document {
    userId: string;
    status: number;
    date: Date;
    hour: number;
    title?: string;
}