import { Document } from "mongoose";

interface workHours extends Document {
    hours: [Number];
}

export default workHours;