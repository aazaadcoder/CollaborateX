import WorkspaceModel from "../models/workspace.model"
import mongoose from 'mongoose';
import RoleModel from '../models/role-permission.model';
import { Roles } from '../enums/role.enum';
import MemberModel from '../models/member.model';
import UserModel from "../models/user.model";
import { BadRequestException, InternalServerException, NotFoundException, UnauthorizedAccessException } from "../utils/appError.util";
import TaskModel from "../models/task.model";
import { TaskstatusEnum } from "../enums/task.enum";
import { NOTFOUND } from "dns";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import ProjectModel from "../models/project.model";

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

export const updateWorkspaceService = async (workspaceId: string, name: string, description: string | undefined) => {

    try {
        // check if the workspace for the id provided exists or not 
        const workspace = await WorkspaceModel.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundException("Workspace not found");
        }

        workspace.name = name || workspace.name;
        workspace.description = description || workspace.description;

        await workspace.save();
        return { workspace };
    } catch (error) {
        throw error;
    }

}

export const deleteWorkspaceService = async (workspaceId: string, userId : string) => {
    /*
    1. check if user exists
    2. check if workspace exists 
    3. check if user is the owner of the workspace
    4. delete the workspace
    5. delete all the project assosiated with the work space
    6. delete all the tasks assosiated with the workspace
    7. delete all the member data 
    7. update the currentworkspace of the users having the deleted workspace as the currentworkspace
    --> so we will use transaction 
    */
    const session = await mongoose.startSession()

    try {

        await session.startTransaction();
        // check if workspace exists 
        const workspace = await WorkspaceModel.findById(workspaceId).session(session);

        if (!workspace) {
            throw new NotFoundException("workspace not found");
        }

        // check if user is the owner of the workspace
        if(workspace.owner.toString() != userId){
            throw new BadRequestException("You are not autharized to perform this action");
        }

        // check if user exits 
        const user = await UserModel.findById(userId).session(session);

        if(!user){
            throw new NotFoundException("User not found");
        }

        // delete all project assigned to this workspace

        await ProjectModel.deleteMany({workspace : workspace._id}).session(session);

        // delete all tasks assosiated to this workspace
        await TaskModel.deleteMany({workspace : workspace._id}).session(session)

        // delete memeber data for this workspace
        await MemberModel.deleteMany({workspaceId : workspace._id}).session(session);

        // update the current workspace for user

        if(user.currentWorkspace?.equals(workspaceId)){
            // get data about any workspace user is part of 
            const  memberWorkspace = await MemberModel.findOne({userId}).session(session);

            // update the current workspace 
            user.currentWorkspace = memberWorkspace ? memberWorkspace?.workspaceId : null;

            await user.save({session});
        }

        // now we can finally delete the workspace
        await workspace.deleteOne({session});

        await session.commitTransaction();

        // return the current workspace
        return {currentWorkspace : user.currentWorkspace}; 
        
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally{
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

        return { analytics };
    } catch (error) {
        throw error;
    }
}

export const changeMemberRoleService = async (workspaceId: string, memberId: string, roleId: string) => {
    try {
        // check if workspace exists
        const workspace = await WorkspaceModel.findById(workspaceId);

        if (!workspace) {
            throw new NotFoundException("Workspace does not exists");
        }

        // check if role  that we want to assign to member exists
        const role = await RoleModel.findById(roleId);

        // todo check if the role to be assigned is not owner as their can be only one owner
        // todo if the new role is same as old role ?

        if (!role) {
            throw new NotFoundException("Role does not exist");
        }

        // check if member is a member of the workspace
        const member = await MemberModel.findOne({ userId: memberId, workspaceId });

        if (!member) {
            throw new NotFoundException("Member not found in workspace")
        }

        // if the member exists in the workspace then change the role
        member.role = role._id as mongoose.Types.ObjectId;
        await member.save();

        return { member };
    } catch (error) {
        throw error;
    }
}