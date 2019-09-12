import mongoose from "mongoose";

const userSchema: mongoose.Schema = new mongoose.Schema({
    hours: {
        type: [Number],
        required: true
    }
})

export default mongoose.model("WorkHours", userSchema);