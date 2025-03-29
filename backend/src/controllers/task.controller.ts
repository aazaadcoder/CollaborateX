import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { projectIdSchema } from "../validation/project.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { Permissions } from "../enums/role.enum";
import { roleGaurd } from "../utils/roleGuard.util";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../validation/task.validation";
import { createTaskService, getAllTasksService, updateTaskService } from "../services/task.service";
import { HTTPSTATUS } from "../config/http.config";


export const createTaskController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);
        const userId = req.user?._id;

        const body = createTaskSchema.parse(req.body);

        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.CREATE_TASK]);

        const { task } = await createTaskService(userId, workspaceId, projectId, body);


        return res.status(HTTPSTATUS.CREATED).json(
            {
                message: "task created successfuly",
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


        const { task } = await updateTaskService(userId, workspaceId, projectId, taskId, body);

        return res.status(HTTPSTATUS.OK).json(
            {
                message: "Task updated Successfully",
                task
            }
        )



    }
)
export const getAllTasksController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const userId = req.user?._id;

        // and we will take various filters from query 

        const filters = {
            projectId: req.query?.projectId as string | undefined,
            priority: req.query.priority ? (req.query.priority as string).split(",") : undefined,
            status: req.query.status ? (req.query.status as string).split(",") : undefined,
            assignedTo: req.query.assignedTo ? (req.query.assignedTo as string).split(",") : undefined,
            keyword: req.query.keyword as string | undefined,
            dueDate: req.query.dueDate as string | undefined,
        }

        const pagination = {
            pageNumber: parseInt(req.params.pageNumer as string) | 1,
            pageSize: parseInt(req.params.pageSize as string) | 10
        }

        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.VIEW_ONLY]);

        const result = await getAllTasksService(workspaceId, filters, pagination);


        return res.status(HTTPSTATUS.OK).json({
            message: "All Tasks fetched successfully",
            ...result
        })


    }
)
export const createesadf = asyncHandler(
    async (req: Request, res: Response) => {

    }
)
export const createfdesad = asyncHandler(
    async (req: Request, res: Response) => {

    }
)