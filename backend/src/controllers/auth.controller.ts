import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { config } from "../config/app.config";

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    
    // try to retrive currentWorkspace of the user 
    const currentWorkspace = req.user?.currentWorkspace;

    // if current workspcace doesnot exist redirect it to callback uri with failure message 
    if (!currentWorkspace) {
        return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`)

})  