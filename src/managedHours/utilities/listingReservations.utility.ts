import ManagedHoursService from "../managedHours.service";
import { IManagedHoursModel } from "../managedHours.interface";
import IReservationList from "../../interfaces/reservationList.interface";

class ListingReservationsUtility {
    private managedHoursService = new ManagedHoursService();

    public getListOfReservations = async (userId: string | null): Promise<IReservationList> => {
        const reservedHours: IManagedHoursModel[] = await this.managedHoursService.findEventsByStatusAndUserId(1, userId);
        const approvedHours: IManagedHoursModel[] = await this.managedHoursService.findEventsByStatusAndUserId(2, userId);
        return {
            reservedHours: reservedHours.length ? reservedHours : "No reserved hours",
            approvedHour: approvedHours.length ? approvedHours : "No approved hours"
        }
    }
}

export default ListingReservationsUtility;