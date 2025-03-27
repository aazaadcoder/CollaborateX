import WorkspaceModel from "../models/workspace.model"
import mongoose from 'mongoose';
import RoleModel from '../models/role-permission.model';
import { Roles } from '../enums/role.enum';
import MemberModel from '../models/member.model';
import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/appError.util";

export const createWorkspaceService = async (userId: string, body: { name: string, description?: string | undefined }) => {

    const session = await mongoose.startSession();

    try {

        await session.startTransaction();

        // check if user exists or not

        const user = await UserModel.findById(userId);

        if (!user) {
            throw new NotFoundException("user not found")
        }

        // todo : check if any workspace exists with same name ? is it needed? 

        // create a workspace document 
        const workspace = new WorkspaceModel(
            {
                name: body.name,
                description: body.description,
                owner: userId,
            }
        )

        await workspace.save({ session });





        // now get role data for owner role

        const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }, null, { session });

        if (!ownerRole) {
            throw new NotFoundException("owner role not found")
        }
        // now create a member document for the owner and the workspace 

        const member = new MemberModel(
            {
                userId: userId,
                role: ownerRole._id,
                workspaceId: workspace._id,
                joinedAt: new Date(),
            }
        )

        await member.save({ session });


        // change the current workspace of the user 

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;

        await user.save({ session })


        // now return the workspace 
        await session.commitTransaction();

        return { workspace }

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


export const getAllUserWorkspacesUserIsMemberService = async (userId: string) => {

    try {
        // check if user exist 

        const user = await UserModel.findById(userId);

        // throw error if user doesnot exist
        if (!user) {
            throw new NotFoundException("User does not exist");
        }

        // fetch all the data of workspaces the user is part of

        const memberships = await MemberModel.find({userId}).populate("workspaceId").exec();
        // mongoose queries donot return promise but when we use exec it dose but there is no functonal difference i can even use a callback 

        // extract workspace data from memebership data 
        const workspaces = memberships.map((memberData) => (memberData.workspaceId))
        
        return {workspaces};
    } catch (error) {
        throw error;
    }

}