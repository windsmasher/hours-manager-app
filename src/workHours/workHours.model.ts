import mongoose from "mongoose";
import IWorkHours from "./workHours.interface";

const workHoursSchema: mongoose.Schema = new mongoose.Schema({
    hours: {
        type: [Number],
        required: true
    }
})

export default mongoose.model<IWorkHours>("WorkHours", workHoursSchema);