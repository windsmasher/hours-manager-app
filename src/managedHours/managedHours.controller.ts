import Controller from "../interfaces/controller.interface";
import express from "express";
import adminAuth from "../middleware/adminAuth.middleware";
import userAuth from "../middleware/userAuth.middleware";
import ManagedHoursService from "./managedHours.service";
import { IManagedHours } from "./managedHours.interface";
import WorkHoursService from "../workHours/workHours.service";
import IWorkHours from "../workHours/workHours.interface";
import StatisticUtilites from "./utilities/statistic.utility";
import ListingReservationsUtility from "./utilities/listingReservations.utility";

class ManagedHoursController implements Controller {
    public path = "/managedhours";
    public router = express.Router();
    private managedHoursService = new ManagedHoursService();
    private workHoursService = new WorkHoursService();
    private statisticUtilities = new StatisticUtilites();
    private listingReservations = new ListingReservationsUtility();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/reserve`, userAuth, this.reserveHour);
        this.router.get(`${this.path}/reserve`, userAuth, this.userReservations);
        this.router.delete(`${this.path}/reserve/:id`, userAuth, this.deleteReservation);
        this.router.post(`${this.path}/approve`, adminAuth, this.approveHour);
        this.router.post(`${this.path}/block`, adminAuth, this.blockHour);
        this.router.get(`${this.path}/reservations`, adminAuth, this.allReservations);
        this.router.get(`${this.path}/statistic`, adminAuth, this.statistic);
    }

    private reserveHour = async (request: any, response: express.Response) => {
        const workHours: IWorkHours | null = await this.workHoursService.getWorkHours();
        if (workHours) {
            const availableHours = workHours.hours;
            const approvedHour = availableHours.filter(hour => hour === request.body.hour);
            if (!approvedHour.length) return response.status(400).send("This hour is not avaiable to reserve.")
            const existingEvent = await this.managedHoursService.findEventByDateHour(request.body.date, request.body.hour);
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

    private approveHour = async (request: express.Request, response: express.Response) => {
        const reservedEventToApprove = await this.managedHoursService.findEventByDateHourStatus(request.body.date, request.body.hour, 1);
        if (reservedEventToApprove) {
            const changedStatusEvent = await this.managedHoursService.changeStatus(reservedEventToApprove._id, 2);
            response.status(200).send(changedStatusEvent);
        } else {
            response.status(400).send("There is no event in this date to approve.");
        }
    }

    private blockHour = async (request: any, response: express.Response) => {
        const workHours: IWorkHours | null = await this.workHoursService.getWorkHours();
        if (workHours) {
            const availableHours = workHours.hours;
            const approvedHour = availableHours.filter(hour => hour === request.body.hour);
            if (!approvedHour.length) return response.status(400).send("This hour is not in work hours anyway.");
            const existingEvent = await this.managedHoursService.findEventByDateHour(request.body.date, request.body.hour);
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

    private allReservations = async (request: express.Request, response: express.Response) => {
        const result = await this.listingReservations.getListOfReservations(null);
        response.status(200).send(result);
    }

    private userReservations = async (request: any, response: express.Response) => {
        const result = await this.listingReservations.getListOfReservations(request.user._id);
        response.status(200).send(result);
    }

    private deleteReservation = async (request: express.Request, response: express.Response) => {
        const deletedReservation = await this.managedHoursService.deleteReservation(request.params.id);
        response.status(200).send(deletedReservation);
    }

    private statistic = async (request: express.Request, response: express.Response) => {
        if(!request.body.fromDate || !request.body.toDate) return response.status(400).send("Bad request.")
        let fromDate = new Date(request.body.fromDate);
        const toDate = new Date(request.body.toDate);
        if(fromDate > toDate) return response.status(400).send("Wrong date range.")
        const result = await this.statisticUtilities.getStatsForRange(fromDate, toDate);
        response.status(200).send(result);
    }
}

export default ManagedHoursController;