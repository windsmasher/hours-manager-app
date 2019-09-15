import IController from "../interfaces/controller.interface";
import express from "express";
import adminAuth from "../middleware/adminAuth.middleware";
import WorkHoursService from "./workHours.service";
import ManagedHoursService from "../managedHours/managedHours.service";

class WorkHoursController implements IController {
    public path = "/workhours";
    public router = express.Router();
    private workHoursService = new WorkHoursService();
    private managedHoursService = new ManagedHoursService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, adminAuth, this.setWorkHours);
    }

    private setWorkHours = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const approvedReservations = await this.managedHoursService.findEventsByStatus(2);
        const reservations = await this.managedHoursService.findEventsByStatus(1);
        if (approvedReservations.length || reservations.length) return response.status(409).send("Delete all reservations before changing work hours.")

        try {
            const savedWorkHours = await this.workHoursService.cleanCollectionAndCreateWorkHours(request.body);
            response.send(savedWorkHours);
        } catch (error) {
            next(error);
        }
    }
}

export default WorkHoursController;