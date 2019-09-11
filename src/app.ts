import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Controller from "./interfaces/controller.interface";

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.connectDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listen on the port ${process.env.PORT}`);
        })
    }

    // public getServer() {
    //     return this.app;
    // }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        })
    }

    private connectDatabase() {
        mongoose.connect(<string>process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
            console.log("Database connected.")
        })
    }
}

export default App;