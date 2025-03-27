import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError.util";
import { z, ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";


const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues?.map((issue) => (
        {
            field: issue.path.join("."),
            message: issue.message,
        }
    ));
    // will return an array errors having multiple error if any 

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation Error",
        errors: errors,
        errorCode : ErrorCodeEnum.VALIDATION_ERROR,
    });
}


export const errorHandler: ErrorRequestHandler = (error, req , res , next ): any => {

    console.log(`Error Occured on PATH: ${req.path}`, error);
    if (error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON format, please check your request body"
        })
    }

    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode
        })
    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error.message || "Unknow Error"
    })
}