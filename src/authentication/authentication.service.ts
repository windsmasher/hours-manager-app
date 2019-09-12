import UserModel from "../user/user.model";
import IUser from "../user/user.interface"
import bcrypt from "bcryptjs";

class AuthenticationService {
    public userModel = UserModel;

    public async register(userData: IUser) {
        if(
            await this.userModel.findOne({ login: userData.login })
        ) {
            throw new Error("User with this email exists.").message
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userData.password, salt);
        const user = await new this.userModel({
            login: userData.login,
            password: hashPassword
        })
        return user.save();
    }
}

export default AuthenticationService;