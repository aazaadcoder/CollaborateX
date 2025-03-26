import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback } from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
const authRoutes = Router();

authRoutes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// when we hit this endpoint the passport js redirects the user to google login page with the endpoint something like https://accounts.google.com/o/oauth2/auth?client_id=XXXXX&redirect_uri=YYYYY&scope=profile 


authRoutes.get("/google/callback", passport.authenticate("google", { failureRedirect: failedUrl }),
    googleLoginCallback
)
// then google responds with success or failure, on failure we redirect the user to the failed url and when sucess we run the googleLoginCallback which tries to redirect user to their current worksapce if it exists other wise redriect again 



export default authRoutes;