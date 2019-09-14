import ManagedHoursModel from "./managedHours.model";
import { IManagedHours, IManagedHoursModel } from "./managedHours.interface";

class ManagedHoursService {
    public managedHoursModel = ManagedHoursModel;

    public async findEventByDate(date: Date, hour: number): Promise<IManagedHoursModel | null> {
        return this.managedHoursModel.findOne({ date: date, hour: hour });
    }

    public async findEventByDateAndStatus(date: Date, hour: number, status: number): Promise<IManagedHoursModel | null> {
        return this.managedHoursModel.findOne({ date: date, hour: hour, status: status });
    }

    public async createReservationHour(newReservationData: IManagedHours) {
        const newReservation = new this.managedHoursModel(newReservationData);
        return newReservation.save();
    }

    public async changeStatus(eventId: string, newStatus: number) {
        return this.managedHoursModel.findOneAndUpdate({ _id: eventId }, { $set: { status: newStatus } }, { new: true });
    }

}

export default ManagedHoursService;