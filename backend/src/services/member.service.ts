import MemberModel from "../models/member.model";
import RoleModel from "../models/role-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException, UnauthorizedAccessException } from "../utils/appError.util";

export const getMemberRoleInWorkspaceService = async (userId: string, workspaceId: string) => {

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

    // if user exists check for member document where user is a member of the workspace with given id and also get the role permisssion data of the user

    const member = await MemberModel.findOne({ userId, workspaceId }).populate("role");

    if (!member) {
        throw new UnauthorizedAccessException("you are not a member of this workspace");
    }

    const roleName = member.role?.name;

    return { role: roleName };
} 

export const getAllWorkspaceMembersService = async (workspaceId :string) => {

    // get data of members of this worksapceid and their role name 
    const members = await MemberModel.find({workspaceId}).populate("userId", "name email profilePicture -password").populate("role", "name");

    // now we will fetch all the roles so that we can display it in the drop down in the client side
    const roles = await RoleModel.find({}, {_id : 1, name : 1 }).select("-permissions").lean();
    // lean coverts the mongoose document into object but then we cannot perfom action like save etc


    return {members, roles};
}