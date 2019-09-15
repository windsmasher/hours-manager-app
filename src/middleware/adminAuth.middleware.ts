import express from "express";
import IRequestWithUser from "../interfaces/requestWithUser.interface";


const adminAuth = async (request: IRequestWithUser, response: express.Response, next: express.NextFunction) => {
    if(!request.user) return response.status(401).send("Access denied.")
    if(!request.user.isAdmin) return response.status(403).send("You have to be admin for this action");
    next();
}

export default adminAuth;