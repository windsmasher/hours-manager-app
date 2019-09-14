import { IManagedHoursModel } from "../managedHours/managedHours.interface";

interface IReservationList {
    reservedHours: IManagedHoursModel[] | string;
    approvedHour: IManagedHoursModel[] | string;
}

export default IReservationList;