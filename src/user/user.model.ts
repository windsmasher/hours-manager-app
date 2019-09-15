import mongoose from "mongoose";
import { IUserModel } from "./user.interface";

const userSchema: mongoose.Schema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
})

export default mongoose.model<IUserModel>("User", userSchema);