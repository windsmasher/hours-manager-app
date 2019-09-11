import userModel from "../user/user.model";
import IUser from "../user/user.interface"
import CommonException from "../exceptions/CommonException";
import bcrypt from "bcryptjs";

class AuthenticationService {
    public user = userModel;

    public async register(userData: IUser) {
        if(
            await this.user.findOne({ login: userData.login })
        ) {
            throw new CommonException(400, "User with this email exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userData.password, salt);
        const user = await new this.user({
            login: userData.login,
            password: hashPassword
        })
        return user;
    }
}

export default AuthenticationService;