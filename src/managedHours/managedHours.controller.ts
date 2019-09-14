import Controller from "../interfaces/controller.interface";
import express from "express";
import adminAuth from "../middleware/adminAuth.middleware";
import userAuth from "../middleware/userAuth.middleware";
import ManagedHoursService from "./managedHours.service";
import { IManagedHours } from "./managedHours.interface";
import WorkHoursService from "../workHours/workHours.service";
import IWorkHours from "../workHours/workHours.interface";

class ManagedHoursController implements Controller {
    public path = "/managedhours";
    public router = express.Router();
    private managedHoursService = new ManagedHoursService();
    private workHoursService = new WorkHoursService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/reserve`, userAuth, this.reserveHour);
        this.router.post(`${this.path}/approve`, adminAuth, this.approveHour);
        this.router.post(`${this.path}/block`, adminAuth, this.blockHour);
    }

    private reserveHour = async (request: any, response: express.Response, next: express.NextFunction) => {
        const workHours: IWorkHours | null = await this.workHoursService.getWorkHours();
        if (workHours) { 
            const availableHours = workHours.hours;
            const approvedHour = availableHours.filter(hour => hour === request.body.hour);
            if (!approvedHour.length) return response.status(400).send("This hour is not avaiable to reserve.")
            const existingEvent = await this.managedHoursService.findEventByDate(request.body.date, request.body.hour);
            if (existingEvent && (existingEvent.status === 1 || existingEvent.status === 2)) return response.status(400).send("There is a reservation on your date.")
            if (existingEvent && existingEvent.status === 0) return response.status(400).send("This date is blocked by admin.")
            const newReservation: IManagedHours = {
                userId: request.user._id,
                status: 1,
                date: request.body.date,
                hour: request.body.hour,
                title: request.body.title
            }
            const savedReservation = await this.managedHoursService.createReservationHour(newReservation);
            response.status(200).send(savedReservation);
        } else {
            response.status(400).send("Database connection error.")
        }
    }

    private approveHour = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const reservedEventToApprove = await this.managedHoursService.findEventByDateAndStatus(request.body.date, request.body.hour, 1);
        console.log("reservedEventToApprove", reservedEventToApprove);
        if (reservedEventToApprove) {
            const changedStatusEvent = await this.managedHoursService.changeStatus(reservedEventToApprove._id, 2);
            console.log("changedStatusEvent", changedStatusEvent);
            response.status(200).send(changedStatusEvent);
        } else {
            response.status(400).send("There is no event in this date to approve.");
        }
    }

    private blockHour = async (request: any, response: express.Response, next: express.NextFunction) => {
        const workHours: IWorkHours | null = await this.workHoursService.getWorkHours();
        if (workHours) {
            const availableHours = workHours.hours;
            const approvedHour = availableHours.filter(hour => hour === request.body.hour);
            if (!approvedHour.length) return response.status(400).send("This hour is not in work hours anyway.");
            const existingEvent = await this.managedHoursService.findEventByDate(request.body.date, request.body.hour);
            if (existingEvent && (existingEvent.status === 1 || existingEvent.status === 2)) return response.status(400).send("There is a reservation on this date.")
            if (existingEvent && existingEvent.status === 0) return response.status(400).send("This date is already blocked.")
            const newReservation: IManagedHours = {
                userId: request.user._id,
                status: 0,
                date: request.body.date,
                hour: request.body.hour
            }
            const savedBlockedHour = await this.managedHoursService.createReservationHour(newReservation);
            response.status(200).send(savedBlockedHour);
        } else {
            response.status(400).send("Database connection error.")
        }
    }
}

export default ManagedHoursController;