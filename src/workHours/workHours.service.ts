import WorkHoursModel from "./workHours.model";
import IWorkHours from "./workHours.interface";

class WorkHoursService {
    public workHoursModel = WorkHoursModel;

    public async cleanCollectionAndCreateWorkHours(workHoursData: IWorkHours): Promise<IWorkHours> {
        await this.workHoursModel.remove({});
        const workHours = await new this.workHoursModel(workHoursData);
        return workHours.save();
    }

    public async getWorkHours(): Promise<IWorkHours | null> {
        return this.workHoursModel.findOne();
    }
}

export default WorkHoursService;