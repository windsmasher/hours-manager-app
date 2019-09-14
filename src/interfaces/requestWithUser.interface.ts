import { Request } from "express";
import user from "../user/user.interface";

interface IRequestWithUser extends Request {
    user: user;
}