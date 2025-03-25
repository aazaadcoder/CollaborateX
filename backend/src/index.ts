import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDataBase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/aynscHandler.middleware";

const app = express();

const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session(
        {
            name: "session",
            keys: [config.SESSION_SECRET],
            maxAge: 24 * 60 * 60 * 1000,
            secure: config.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax"
        }
    )
)

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true
    })
)

app.get("/", asyncHandler((req: Request, res: Response, next: NextFunction) => {

    throw Error("Error aa gaya bhai dekho to kya hua")
    res.status(HTTPSTATUS.OK).json({
        message: "Welcome to Backend"
    })



}))

app.use(errorHandler);

app.listen(config.PORT, async () => {
    console.log(`Listening to PORT: ${config.PORT} in ${config.NODE_ENV}`);
    await connectDataBase();
})
