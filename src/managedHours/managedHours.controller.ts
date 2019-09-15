import IController from "../interfaces/controller.interface";
import express from "express";
import adminAuth from "../middleware/adminAuth.middleware";
import userAuth from "../middleware/userAuth.middleware";
import ManagedHoursService from "./managedHours.service";
import { IManagedHours } from "./managedHours.interface";
import WorkHoursService from "../workHours/workHours.service";
import IWorkHours from "../workHours/workHours.interface";
import ManagedHoursUtilities from "./managedHours.utilities";
import IRequestWithUser from "../interfaces/requestWithUser.interface";

class ManagedHoursController implements IController {
    public path = "/managedhours";
    public router = express.Router();
    private managedHoursService = new ManagedHoursService();
    private workHoursService = new WorkHoursService();
    private managedHoursUtilities = new ManagedHoursUtilities();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/reserve`, userAuth, this.changeHourStatus(1));
        this.router.get(`${this.path}/reserve`, userAuth, this.userReservations);
        this.router.delete(`${this.path}/reserve/:id`, userAuth, this.deleteReservation);
        this.router.post(`${this.path}/approve`, adminAuth, this.approveHour);
        this.router.post(`${this.path}/block`, adminAuth, this.changeHourStatus(0));
        this.router.get(`${this.path}/reservations`, adminAuth, this.allReservations);
        this.router.get(`${this.path}/statistic`, adminAuth, this.statistic);
    }

    // this function returns middleware for reserve (1) or block action (0) because they have the same logic
    private changeHourStatus = (status: number): express.RequestHandler => {
        return async (request: IRequestWithUser, response: express.Response) => {
            if (!request.user) return response.status(401).send("No user information provided.");
            const workHours: IWorkHours | null = await this.workHoursService.getWorkHours();
            if (!workHours) return response.status(400).send("Database connection error.")
            const availableHours = workHours.hours;
            const approvedHour = availableHours.filter(hour => hour === request.body.hour);
            if (!approvedHour.length) return response.status(400).send("This hour is not in work hours.")
            const existingEvent = await this.managedHoursService.findEventByDateHour(request.body.date, request.body.hour);
            if (existingEvent && (existingEvent.status === 1 || existingEvent.status === 2)) return response.status(400).send("There is a reservation on this date.")
            if (existingEvent && existingEvent.status === 0) return response.status(400).send("This date is blocked.")
            const newEvent: IManagedHours = {
                userId: request.user._id,
                status: status,
                date: request.body.date,
                hour: request.body.hour,
                title: request.body.title
            }
            const savedEvent = await this.managedHoursService.createReservationHour(newEvent);
            response.status(200).send(savedEvent);
        }
    }

    private approveHour = async (request: express.Request, response: express.Response) => {
        const reservedEventToApprove = await this.managedHoursService.findEventByDateHour(request.body.date, request.body.hour);
        if (!reservedEventToApprove) return response.status(400).send("There is no event in this date to approve.");
        if (reservedEventToApprove.status === 1) {
            const changedStatusEvent = await this.managedHoursService.changeStatus(reservedEventToApprove._id, 2);
            response.status(200).send(changedStatusEvent);
        } else {
            response.status(400).send("This hour is blocked or approved already.");
        }
    }

    private allReservations = async (request: express.Request, response: express.Response) => {
        const result = await this.managedHoursUtilities.getListOfReservations(null);
        response.status(200).send(result);
    }

    private userReservations = async (request: IRequestWithUser, response: express.Response) => {
        if (!request.user) return response.status(401).send("No user information provided.");
        const result = await this.managedHoursUtilities.getListOfReservations(request.user._id);
        response.status(200).send(result);
    }

    private deleteReservation = async (request: express.Request, response: express.Response) => {
        const deletedReservation = await this.managedHoursService.deleteReservation(request.params.id);
        response.status(200).send(deletedReservation);
    }

    private statistic = async (request: express.Request, response: express.Response) => {
        if (!request.body.fromDate || !request.body.toDate) return response.status(400).send("Bad request.")
        let fromDate = new Date(request.body.fromDate);
        const toDate = new Date(request.body.toDate);
        if (fromDate > toDate) return response.status(400).send("Wrong date range.")
        const result = await this.managedHoursUtilities.getStatsForRange(fromDate, toDate);
        response.status(200).send(result);
    }
}

export default ManagedHoursController;