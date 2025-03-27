import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/appError.util";


export const getCurrentUserService = async (userId : string) => {
        // we will try to retrive user data, its workspace data, wihtout password


        const user = await UserModel.findById(userId).populate("currentWorkspace").select("-password");

        if (!user) {
            throw new BadRequestException("User not found");
        }
        console.log(user)
        return { user };
    }
