import { NextFunction, Response, Request } from 'express';
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { createWorkspaceSchema } from '../validation/workspace.validation';
import { createWorkspaceService, getAllUserWorkspacesUserIsMemberService } from '../services/workspace.service';
import { HTTPSTATUS } from '../config/http.config';


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