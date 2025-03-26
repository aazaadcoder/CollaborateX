import mongoose from "mongoose";
import UserModel from "../models/user.model";
import accountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/role-permission.model";
import { Roles } from "../enums/role.enum";
import { NotFoundException } from "../utils/appError.util";
import MemberModel from "../models/member.model";


export const loginOrCreateAccountService = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => {
    const { email, provider, providerId, displayName, picture } = data;

    const session = await mongoose.startSession();
    try {
        // will check if user already exits in db
        let user = await UserModel.findOne({ email }, null, { session });

        if (!user) {
            // create user if not exist
            user = new UserModel(
                {
                    email,
                    name: displayName,
                    profilePicture: picture || null,
                }
            );

            await user.save({ session });

            // now we will create an account for the user

            const account = new accountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            })

            await account.save({ session });

            // now we will create a new worksapce for the new user

            const workspace = new WorkspaceModel({
                name: "My Workspace",
                description: `Workspace created for ${user.name}`,
                owner: user._id
            })

            await workspace.save({ session });

            // fetching owner roles from the role collection as will have to create a membe doccuement for this user and its wokrspace and will have to specify the role of this user in its workspace

            const ownerRole = await RoleModel.findOne({
                name: Roles.OWNER,
            }, null, { session });

            if (!ownerRole) {
                throw new NotFoundException("Owner role not found ");
            }

            // now we create a member document fot the current user and its workspace and its role

            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            })

            await member.save({ session });

            // now we will update the currentWorkspace field of the current user which is null as of now 

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            // tostudy : as  mongoose.Types.ObjectId is a ts type assesertion 

            await user.save({ session });
        }

        // we will commit transation when all actions are done
        await session.commitTransaction();

        // now we will return an object with user object as one of it key
        return {user};
        
    } catch (error) {
        await session.abortTransaction();

        throw error;

    } finally {
        // end the session 
        session.endSession()

    }
}