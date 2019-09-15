import express from "express";
import userModel from "../user/user.model";
import userValidation from "../middleware/userValidation.middleware";
import AuthenticationService from './authentication.service';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Controller from "../interfaces/controller.interface";
import { IUserModel } from "../user/user.interface";

class AuthenticationController implements Controller {
    public path = "/auth";
    public router = express.Router();
    public authenticationService = new AuthenticationService();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, userValidation(), this.registration);
        this.router.post(`${this.path}/login`, this.login)
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const savedUser = await this.authenticationService.register(request.body);
            response.send(savedUser);
        } catch (error) {
            next(error);
        }
    }

    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const user: IUserModel | null = await this.authenticationService.findUserByLogin(request.body.login)
        if (user) {
            const isPasswordMatching = await bcrypt.compare(request.body.password, user.password)
            if (isPasswordMatching) {
                const token = jwt.sign({ _id: user._id }, <string>process.env.TOKEN_SECRET);
                response.header("token", token).send(token);
                response.send(user);
            } else {
                next(response.status(401).send("Wrong login or password"));
            }
        } else {
            next(response.status(401).send("Wrong login or password"));
        }
    }
}

export default AuthenticationController;