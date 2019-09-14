import dotenv from "dotenv";
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import WorkHoursController from "./workHours/workHours.controller";
import ManagedHoursController from "./managedHours/managedHours.controller";

dotenv.config();

const app = new App(
    [
        new AuthenticationController(),
        new WorkHoursController(),
        new ManagedHoursController()
    ],
);

app.listen();