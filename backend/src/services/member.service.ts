import MemberModel from "../models/member.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException, UnauthorizedAccessException } from "../utils/appError.util";

export const getMemberRoleService = async (userId: string, workspaceId: string) => {

    // check if user exists 
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new NotFoundException("User Does not exists");
    }


    // check if the workspace for the id provided exists or not 

    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    // if user exists check for member document where user is a member of the workspace with given id and also get the workspace data if this relation exist that is return workspace if user is its member 

    const member = await MemberModel.findOne({ userId, workspaceId }).populate("role");

    if (!member) {
        throw new UnauthorizedAccessException("you are not a member of this workspace");
    }

    const roleName = member.role?.name;

    return { role: roleName };
}  