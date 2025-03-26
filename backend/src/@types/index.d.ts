import { UserDocument } from "../models/user.model";



declare global {
    namespace Express {
        interface User extends UserDocument {
            _id?: any;
        }
        // modifies the Express.User to include properities fromUserDocment, req.user now has all the properites of User and an _id
    }
}