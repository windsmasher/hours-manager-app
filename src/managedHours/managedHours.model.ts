import mongoose from "mongoose";
import { IManagedHoursModel } from "./managedHours.interface";

const managedHoursSchema: mongoose.Schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: Number, // 0 - blocked, 1 - reserved, 2 - approved
        required: true   
    },
    date: {
        type: Date,
        required: true
    },
    hour: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: false
    }
})

export default mongoose.model<IManagedHoursModel>("ManagedHours", managedHoursSchema);