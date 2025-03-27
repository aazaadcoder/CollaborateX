import { NextFunction, Request, Response } from "express";
import { UnauthorizedAccessException } from "../utils/appError.util";

const isAuthenticated = (req : Request ,  res: Response, next : NextFunction) =>{
    // check if req has user object and user object has userid if not authirzation error
    if(!req.user || !req.user._id){
        throw new UnauthorizedAccessException("Unauhtorized. Please login")
    }

    // if req has user data call the next fxn 
    next();
}

export default isAuthenticated;