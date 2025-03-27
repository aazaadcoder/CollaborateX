import { NextFunction, Response, Request } from 'express';
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { createWorkspaceSchema, workspaceIdSchema } from '../validation/workspace.validation';
import { createWorkspaceService, getAllUserWorkspacesUserIsMemberService, getWorkspaceByIdService } from '../services/workspace.service';
import { HTTPSTATUS } from '../config/http.config';
import { UnauthorizedAccessException } from '../utils/appError.util';
import { getAllWorkspaceMembersService, getMemberRoleInWorkspaceService } from '../services/member.service';
import { Permissions } from '../enums/role.enum';
import { roleGaurd } from '../utils/roleGuard.util';


export const createWorkspaceController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        // get user input for worksapce from req.bosy and validate it 
        const body = createWorkspaceSchema.parse(req.body);

        // access userId from req.user
        const userId = req.user?._id;

        // create workspace 
        const { workspace } = await createWorkspaceService(userId, body);

        return res.status(HTTPSTATUS.CREATED).json({
            message : "Workspace cretated successfully",
            workspace,
        })

    }
)

export const getAllUserWorkspacesUserIsMemberController = asyncHandler(
    async (req: Request, res: Response) => {
        
        const userId = req.user?._id;

        const {workspaces} = await getAllUserWorkspacesUserIsMemberService(userId);

        return res.status(HTTPSTATUS.OK).json({
            message : "Workspace data for the current user fetched successfully.",
            workspaces
        })
    }
)

export const getWorkspaceByIdController = asyncHandler (
    async (req: Request , res: Response) => {
        
        // retrive workspace id from params
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        // retrive user id form req 
        const userId = req.user?._id;


        // get role of current user in the workspace requested 
        await getMemberRoleInWorkspaceService(userId, workspaceId);

        // if user has a role in the workspace , get workspace data
        const {workspace} = await getWorkspaceByIdService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message : "workspace data fetched successfully",
            workspace
        });

        
    }
)

export const getWorkspaceMembersController = asyncHandler (
    async (req : Request , res : Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const userId = req.user?._id;

        // we get the role of the user 
        const {role} = await getMemberRoleInWorkspaceService(userId, workspaceId);

        // now check if the user role has permission required to see the members of this workspace
        roleGaurd(role, [Permissions.VIEW_ONLY]);
        // this will throw an error if the role does not has all the permissions required to perform action below

        // now get all the members and possible values of role 
        const {members, roles} = await getAllWorkspaceMembersService(workspaceId);


        // return all members and all possible roles to client
        return res.status(HTTPSTATUS.OK).json(
            {
                message : "workspace members fetched successfully",
                members,
                roles
            }
        )


    }
)