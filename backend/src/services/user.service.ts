import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/appError.util";


export const getCurrentUserService = async (userId : string) => {
        // we will try to retrive user data, its workspace data, wihtout password
        const user = await UserModel.findById(userId).populate("workspace").select("-password");

        if (!user) {
            throw new BadRequestException("User not found");
        }
        return { user };
    }
