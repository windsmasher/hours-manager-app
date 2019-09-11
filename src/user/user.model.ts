import mongoose from "mongoose";

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
    }
})

export default mongoose.model("User", userSchema);