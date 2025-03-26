import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    // const currentWorkspace = req.user?.currentWorkspace
})