import jwt from "jsonwebtoken";
import express from "express"
import UserModel from '../user/user.model';
import IRequestWithUser from "../interfaces/requestWithUser.interface";
import IIdStoredInToken from "../interfaces/idStoredInToken.interface";

const userAuth = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
    const token = request.header("token");
    if (!token) return response.status(401).send("Access denied.");
    try {
        const verificationResponse = jwt.verify(token, <string>process.env.TOKEN_SECRET) as IIdStoredInToken;
        const user = await UserModel.findById(verificationResponse._id);
        if (!user) return response.status(403).send("Invalid token")
        request.user = user;
        next();
    } catch (error) {
        next(response.status(403).send("Invalid token"))
    }
}

export default userAuth;