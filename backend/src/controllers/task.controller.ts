import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { projectIdSchema } from "../validation/project.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { Permissions } from "../enums/role.enum";
import { roleGaurd } from "../utils/roleGuard.util";
import { createTaskSchema } from "../validation/task.validation";
import { createTaskService } from "../services/task.service";
import { HTTPSTATUS } from "../config/http.config";


export const createTaskController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const userId = req.user?._id;

        const body = createTaskSchema.parse(req.body);

        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.CREATE_TASK]);

        const {task} = await createTaskService(userId, workspaceId, projectId, body);


        return res.status(HTTPSTATUS.CREATED).json(
            {
                message : "task created successfuly",
                task
            }
        )

    }
)
export const createTaskControe = asyncHandler(
    async (req: Request, res: Response) => {

    }
)
export const createesad = asyncHandler(
    async (req: Request, res: Response) => {

    }
)