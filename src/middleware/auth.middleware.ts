import jwt from "jsonwebtoken";
import express from "express"
import CommonException from "../exceptions/CommonException";
import userModel from '../user/user.model';

const auth = async (request: any, response: express.Response, next: express.NextFunction) => {
    const token = request.header("token");
    if (!token) return response.status(401).send("Access denied.");
    try {
        const verificationResponse: any = jwt.verify(token, <string>process.env.TOKEN_SECRET);
        const id = verificationResponse._id;
        const user = await userModel.findById(id);
        if (user) {
            request.user = user;
            next();
        } else {
            next(new CommonException(400, "Invalid token"))
        }
    } catch (error) {
        next(new CommonException(400, "Invalid token"))
    }
}

export default auth;