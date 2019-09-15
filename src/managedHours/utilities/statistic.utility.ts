import ManagedHoursService from "../managedHours.service";
import WorkHoursService from "../../workHours/workHours.service";

class StatisticUtilites {
    private managedHoursService = new ManagedHoursService();
    private workHoursService = new WorkHoursService();

    public getStatsForRange = async (fromDate: Date, toDate: Date) => {
        let day = new Date(fromDate);
        const stats = [];
        do {
            let oneDayStats = await this.getStatsForDay(day);
            stats.push(oneDayStats);
            day = new Date(day.setDate(day.getDate() + 1));
        } while (day <= toDate)
        return stats;
    }

    private getStatsForDay = async (date: Date) => {
        const blocked = await this.managedHoursService.findEventsByDateAndStatus(date, 0);
        const reservations = await this.managedHoursService.findEventsByDateAndStatus(date, 1);
        const approved = await this.managedHoursService.findEventsByDateAndStatus(date, 2);
        const work = await this.workHoursService.getWorkHours();
        let freeHours: number | string;
        work ? freeHours = work.hours.length - reservations.length - approved.length - blocked.length : freeHours = "No information."
        return {
            [this.getDateToDisplay(date)]: {
                reservations: reservations.length,
                approvedHours: approved.length,
                blockedHours: blocked.length,
                freeHours: freeHours
            }
        }
    }

    private getDateToDisplay = (date: Date): string => {
        const dd = date.getDate();
        const mm = date.getMonth();
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`
    }
}

export default StatisticUtilites;
