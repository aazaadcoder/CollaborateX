import WorkspaceModel from "../models/workspace.model"
import mongoose from 'mongoose';
import RoleModel from '../models/role-permission.model';
import { Roles } from '../enums/role.enum';
import MemberModel from '../models/member.model';
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedAccessException } from "../utils/appError.util";
import TaskModel from "../models/task.model";
import { TaskstatusEnum } from "../enums/task.enum";

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

        const memberships = await MemberModel.find({ userId }).populate("workspaceId").exec();
        // mongoose queries donot return promise but when we use exec it dose but there is no functonal difference i can even use a callback 

        // extract workspace data from memebership data 
        const workspaces = memberships.map((memberData) => (memberData.workspaceId))

        return { workspaces };
    } catch (error) {
        throw error;
    }

}

export const getWorkspaceByIdService = async (workspaceId: string) => {

    try {
        // // check if user exists 
        // const user = await UserModel.findById(userId);

        // if (!user) {
        //     throw new NotFoundException("User Does not exists");
        // }

        const workspace = await WorkspaceModel.findById(workspaceId);

        if (!workspaceId) {
            throw new NotFoundException("workspace doesnot exists");
        }

        // now we will also fetch all the members of the workspace and their role data which will be used to handle permissions on the client side
        const members = await MemberModel.find({ workspaceId }).populate("role");

        const workspaceWithMembers = {
            ...workspace?.toJSON,
            members
        }

        return { workspace: workspaceWithMembers };
    } catch (error) {
        throw error;
    }

    // Q : is try catch needed here really ?


}

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {

    try {
        // retrive currentdate 
        const currentDate = new Date();

        // fetch total tasks in the workspace 
        const totalTasks = await TaskModel.countDocuments({ workspace: workspaceId });

        //  fetch overdue tasks 
        const overdueTasks = await TaskModel.countDocuments(
            {
                workspace: workspaceId,
                dueDate: { $lt: currentDate },     // where duedate is less than current date
                status: { $ne: TaskstatusEnum.DONE }  // where status is not equal to done 
            }
        )

        // fetch completed tasks
        const completedTasks = await TaskModel.countDocuments(
            {
                workspace: workspaceId,
                status: { $eq: TaskstatusEnum.DONE },    // where status is equal to done 
            }
        )

        const analytics = {
            totalTasks,
            overdueTasks,
            completedTasks,
        }

        return {analytics};
    } catch (error) {
        throw error;
    }
}