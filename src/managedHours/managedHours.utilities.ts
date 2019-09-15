import ManagedHoursService from "./managedHours.service";
import WorkHoursService from "../workHours/workHours.service";
import IStatistic from "../interfaces/statistic.interface";
import { IManagedHoursModel } from "./managedHours.interface";
import IReservationList from "../interfaces/reservationList.interface";

class ManagedHoursUtilities {
    private managedHoursService = new ManagedHoursService();
    private workHoursService = new WorkHoursService();

    public getListOfReservations = async (userId: string | null): Promise<IReservationList> => {
        const reservedHours: IManagedHoursModel[] = await this.managedHoursService.findEventsByStatusAndUserId(1, userId);
        const approvedHours: IManagedHoursModel[] = await this.managedHoursService.findEventsByStatusAndUserId(2, userId);
        return {
            reservedHours: reservedHours.length ? reservedHours : "No reserved hours",
            approvedHour: approvedHours.length ? approvedHours : "No approved hours"
        }
    }

    public getStatsForRange = async (fromDate: Date, toDate: Date): Promise<IStatistic[]> => {
        let day = new Date(fromDate);
        const stats: IStatistic[] = [];
        do {
            let oneDayStats: IStatistic = await this.getStatsForDay(day);
            stats.push(oneDayStats);
            day = new Date(day.setDate(day.getDate() + 1));
        } while (day <= toDate)
        return stats;
    }

    private getStatsForDay = async (date: Date): Promise<IStatistic> => {
        const blocked = await this.managedHoursService.findEventsByDateAndStatus(date, 0);
        const reservations = await this.managedHoursService.findEventsByDateAndStatus(date, 1);
        const approved = await this.managedHoursService.findEventsByDateAndStatus(date, 2);
        const work = await this.workHoursService.getWorkHours();
        let freeHours: number | string;
        work ? freeHours = work.hours.length - reservations.length - approved.length - blocked.length : freeHours = "No information."
        return {
            date: this.getDateToDisplay(date),
            reservations: reservations.length,
            approvedHours: approved.length,
            blockedHours: blocked.length,
            freeHours: freeHours
        }
    }

    private getDateToDisplay = (date: Date): string => {
        const dd = date.getDate();
        const mm = date.getMonth();
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`
    }
}

export default ManagedHoursUtilities;
