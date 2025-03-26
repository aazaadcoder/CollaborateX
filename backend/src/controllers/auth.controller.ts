import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    
    // try to retrive currentWorkspace of the user 
    const currentWorkspace = req.user?.currentWorkspace;

    // if current workspcace doesnot exist redirect it to callback uri with failure message 
    if (!currentWorkspace) {
        return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`)

})

export const registerUserController = asyncHandler(
    async (req : Request , res : Response) => {
        const body = registerSchema.parse({...req.body});
        // this parses the object passed and validates it and return error if validation fails

        // will register the user
        await registerUserService(body);

        // send res to client if user is created
        return res.status(HTTPSTATUS.CREATED).json({
            message : "User created successfully",
        })
    })