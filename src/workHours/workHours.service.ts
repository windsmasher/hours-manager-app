import WorkHoursModel from "./workHours.model";
import IWorkHoursModel from "./workHours.interface";
import { Model } from "mongoose";

class WorkHoursService {
    public workHoursModel: Model<IWorkHoursModel> = WorkHoursModel;

    public async cleanCollectionAndCreateWorkHours(workHoursData: IWorkHoursModel): Promise<IWorkHoursModel> {
        await this.workHoursModel.remove({});
        const workHours = await new this.workHoursModel(workHoursData);
        return workHours.save();
    }

    public async getWorkHours(): Promise<IWorkHoursModel | null> {
        return this.workHoursModel.findOne();
    }
}

export default WorkHoursService;