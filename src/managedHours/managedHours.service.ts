import ManagedHoursModel from "./managedHours.model";
import { IManagedHours, IManagedHoursModel } from "./managedHours.interface";
import { Model } from "mongoose";

class ManagedHoursService {
    public managedHoursModel: Model<IManagedHoursModel> = ManagedHoursModel;

    public async findEventByDateHour(date: Date, hour: number): Promise<IManagedHoursModel | null> {
        return this.managedHoursModel.findOne({ date: date, hour: hour });
    }

    public async createReservationHour(newReservationData: IManagedHours): Promise<IManagedHoursModel> {
        const newReservation = new this.managedHoursModel(newReservationData);
        return newReservation.save();
    }

    public async changeStatus(eventId: string, newStatus: number): Promise<IManagedHoursModel | null> {
        return this.managedHoursModel.findOneAndUpdate({ _id: eventId }, { $set: { status: newStatus } }, { new: true });
    }

    public async findEventsByStatusAndUserId(status: number, userId: string): Promise<IManagedHoursModel[]> {
        return this.managedHoursModel.find({ userId: userId, status: status });
    }

    public async findEventsByStatus(status: number): Promise<IManagedHoursModel[]> {
        return this.managedHoursModel.find({status: status});
    }

    public async deleteReservation(eventId: string): Promise<IManagedHoursModel | null> {
        return this.managedHoursModel.findByIdAndRemove(eventId);
    }

    public async findEventsByDateAndStatus(date: Date, status: number): Promise<IManagedHoursModel[]> {
        return this.managedHoursModel.find({ date: date, status: status });
    }
}

export default ManagedHoursService;