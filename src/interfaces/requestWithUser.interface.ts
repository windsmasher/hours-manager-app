import { Request } from "express";
import { IUserModel } from "../user/user.interface";

interface IRequestWithUser extends Request {
    user?: IUserModel;
}

export default IRequestWithUser;