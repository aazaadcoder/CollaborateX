import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";


const userRoute = Router();

userRoute.get("/current", getCurrentUserController);


export default userRoute;