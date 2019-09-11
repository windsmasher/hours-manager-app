import express from "express";
import userModel from "../user/user.model";
import validateUser from "../middleware/userValidation.middleware";
import AuthenticationService from './authentication.service';
import CommonException from "../exceptions/CommonException";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Controller from "../interfaces/controller.interface";

class AuthenticationController implements Controller {
    public path = "/auth";
    public router = express.Router();
    public authenticationService = new AuthenticationService();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validateUser(), this.registration);
        this.router.post(`${this.path}/login`, this.login)
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const savedUser = await this.authenticationService.register(request.body);
            response.send({ id: savedUser._id });
        } catch (error) {
            next(error);
        }
    }

    private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const user: any = await this.user.findOne({ login: request.body.login });
        console.log(user);
        if (user) {
            const isPasswordMatching = await bcrypt.compare(request.body.password, user.password)
            if (isPasswordMatching) {
                const token = jwt.sign({ _id: user._id }, <string>process.env.TOKEN_SECRET);
                response.header("token", token).send(token);
                response.send(user);
            } else {
                next(new CommonException(401, "Wrong credentials provided."));
            }
        } else {
            next(new CommonException(401, "Wrong credentials provided."));
        }
    }
}

export default AuthenticationController;