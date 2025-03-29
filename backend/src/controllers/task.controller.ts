import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { projectIdSchema } from "../validation/project.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { Permissions } from "../enums/role.enum";
import { roleGaurd } from "../utils/roleGuard.util";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../validation/task.validation";
import { createTaskService, updateTaskService } from "../services/task.service";
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
export const updateTaskController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const taskId = taskIdSchema.parse(req.params.taskId);
        const userId = req.user?._id;

        const body = updateTaskSchema.parse(req.body);

        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.EDIT_TASK]);


        const {task} = await updateTaskService(userId, workspaceId, projectId, taskId, body);

        return res.status(HTTPSTATUS.OK).json(
            {
                message : "Task updated Successfully",
                task
            }
        )



    }
)
export const createesad = asyncHandler(
    async (req: Request, res: Response) => {

    }
)