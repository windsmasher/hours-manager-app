import Controller from "../interfaces/controller.interface";
import express from "express";
import adminAuth from "../middleware/adminAuth.middleware";
import WorkHoursService from "./workHours.service";

class WorkHoursController implements Controller {
    public path = "/workhours";
    public router = express.Router();
    private workHoursService = new WorkHoursService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, adminAuth, this.addWorkHours);
    }

    private addWorkHours = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const savedWorkHours = await this.workHoursService.cleanCollectionAndCreateWorkHours(request.body);
            response.send(savedWorkHours);
        } catch (error) {
            next(error)
        }
    }
}

export default WorkHoursController;