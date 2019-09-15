import ManagedHoursModel from "./managedHours.model";
import { IManagedHours, IManagedHoursModel } from "./managedHours.interface";

class ManagedHoursService {
    public managedHoursModel = ManagedHoursModel;

    public async findEventByDateHour(date: Date, hour: number): Promise<IManagedHoursModel | null> {
        return this.managedHoursModel.findOne({ date: date, hour: hour });
    }

    public async findEventByDateHourStatus(date: Date, hour: number, status: number): Promise<IManagedHoursModel | null> {
        return this.managedHoursModel.findOne({ date: date, hour: hour, status: status });
    }

    public async createReservationHour(newReservationData: IManagedHours) {
        const newReservation = new this.managedHoursModel(newReservationData);
        return newReservation.save();
    }

    public async changeStatus(eventId: string, newStatus: number) {
        return this.managedHoursModel.findOneAndUpdate({ _id: eventId }, { $set: { status: newStatus } }, { new: true });
    }

    public async findEventsByStatusAndUserId(status: number, userId: string | null): Promise<IManagedHoursModel[]> {
        if (userId === null) return this.managedHoursModel.find({ status: status });
        return this.managedHoursModel.find({ userId: userId, status: status });
    }

    public deleteReservation(eventId: string) {
        return this.managedHoursModel.findByIdAndRemove(eventId);
    }

    public findEventsByDateAndStatus(date: Date, status: number) {
        return this.managedHoursModel.find({date: date, status: status});
    }

    public findEventsByStatus(status: number) {
        return this.managedHoursModel.find({status: status});
    }
}

export default ManagedHoursService;