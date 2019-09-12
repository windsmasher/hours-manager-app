import dotenv from "dotenv";
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import WorkHoursController from "./workHours/workHours.controller";

dotenv.config();

const app = new App(
    [
        new AuthenticationController(),
        new WorkHoursController()
    ],
);

app.listen();