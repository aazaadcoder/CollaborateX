import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";



export const getCurrentUserController = asyncHandler(
    async (req : Request , res : Response) => {
        const userId = req.user?._id;
        
        const {user} = await getCurrentUserService(userId);

        return res.status(HTTPSTATUS.OK).json(
            {
                messsage : "user fetch successful",
                user,
            }
        );
    }
)