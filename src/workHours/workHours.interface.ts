import { Document } from "mongoose";

interface IWorkHours extends Document {
    hours: [Number];
}

export default IWorkHours;