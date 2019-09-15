import { Document } from "mongoose";

interface IWorkHoursModel extends Document {
    hours: [Number];
}

export default IWorkHoursModel;