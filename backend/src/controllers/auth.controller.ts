import { HTTPSTATUS } from './../config/http.config';
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { registerUserService } from "../services/auth.service";
import passport from "passport";
import { UnauthorizedAccessException } from "../utils/appError.util";


// this function is called when user is atenticated successfully by google 
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

export const loginUserController = asyncHandler(async(req : Request, res : Response, next :NextFunction) => {


    //  now we will call the local startegy and it will give a resopnse thorugh done callback which we will
    // pass in the authetical fxn
    passport.authenticate("local",
        (
            err : Error | null,
            user : Express.User | false,
            info : {message : string} | undefined
        ) => {
            if(err) {
                return next(err);
            }

            if(!user){
                return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                    message : info?.message ||"Invaild email or password"
                })
            }

            // if user exists we login the user

            // now login the user by saving its session in req.session using passport/s req.logIn
            req.logIn(user, (err) => {
                if(err){
                    return next(err);
                }

                return res.status(HTTPSTATUS.OK).json({
                    message  : "Logged in Successful.",
                    user,
                });
            })
        }
    )(req, res, next);



})