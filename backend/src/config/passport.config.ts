import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy} from "passport-local";
import { config } from "./app.config";
import { Request } from "express";
import { NotFoundException } from "../utils/appError.util";
import { ProvideEnum } from "../enums/account.provider";
import { loginOrCreateAccountService, verifyUserService } from "../services/auth.service";


passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,  // endpoint google redirects to after authentication 
            scope: ["profile", "email"], // get these details from google
            passReqToCallback: true,  // to pass req to callback 

        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;   //contains raw user data from Google

                // console.log("googleId", googleId);
                // console.log("profile", profile);
                if (!googleId) {
                    throw new NotFoundException("Google Id (sub) is missing");
                }

                const { user } = await loginOrCreateAccountService({   // login or signup using data given by google
                    provider: ProvideEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email,
                })

                done(null, user)  //  attaches the details to session in req and calls next middleware
            } catch (error) {
                done(error, false) // throws error for the errorhandler to catch 
            }
        }
    )
)

// setup local strategy to login using email and password
passport.use(
    new LocalStrategy(
        {
            usernameField : "email",
            passwordField : "password",
            session : true
        },
        // passport extracts email and password from req and passes to the callback
        async (email , password, done) => {
            try {
                // try to retrive user info 
                const user = await verifyUserService({email, password});

                return done(null, user);
            } catch (error : any) {
                return done(error, false, {message : error.message})
            }
        }
    )   

)

passport.serializeUser((user: any, done) => done(null, user))
// passport calls this fxn when user is authenticated successfully and user object is stored in session.
//  done(null, user) saves user inside req.session.passport.user


passport.deserializeUser((user: any, done)=> done(null, user))
// whenever reqest is made by the user retrives user object from session and attaches it to req

// tostudy : passport js auth
