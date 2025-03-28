import e, { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../validation/project.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { roleGaurd } from "../utils/roleGuard.util";
import { Permissions } from "../enums/role.enum";
import { createProjectService, deleteProjectService, getAllWorkspaceProjectService, getProjectAnalyticService, getProjectByIdAndWorkspaceIdService, updateProjectService } from "../services/project.service";
import { HTTPSTATUS } from "../config/http.config";

export const createProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const body = createProjectSchema.parse(req.body);


        // get user role and check if he has permission

        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);

        roleGaurd(role, [Permissions.CREATE_PROJECT]);


        const { project } = await createProjectService(workspaceId, userId, body);

        res.status(HTTPSTATUS.CREATED).json({
            message: "Project has been successfully created",
            project,
        })




    }
)

export const getAllWorkspaceProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        // check if user is a member of the workspace or not and this will also check if user and workspace exist 
        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);

        roleGaurd(role, [Permissions.VIEW_ONLY])

        // pagination 
        const pageSize = parseInt(req.query?.pageSize as string) || 10;
        const pageNumber = parseInt(req.query?.pageNumber as string) || 1;


        // if user is a member then fetch all projects 

        const { projects, totalProjects, totalPages, skip } = await getAllWorkspaceProjectService(workspaceId, pageSize, pageNumber);

        return res.status(HTTPSTATUS.OK).json({
            message: "project created successfully",
            projects,
            pagination: {
                totalProjects,
                totalPages,
                pageNumber,
                pageSize,
                skip,
                limit: pageSize,
            }
        })
    }
)

export const getProjectByIdAndWorkspaceIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);

        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.VIEW_ONLY]);

        const { project } = await getProjectByIdAndWorkspaceIdService(projectId, workspaceId);


        return res.status(HTTPSTATUS.OK).json({
            message: "project fetched succesfully",
            project
        })
    }
)

export const getProjectAnalyticsController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
        const projectId = projectIdSchema.parse(req.params.projectId);

        // check role of user
        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.VIEW_ONLY]);


        const { analytics } = await getProjectAnalyticService(projectId, workspaceId);

        return res.status(HTTPSTATUS.OK).json(
            {
                message: "project analytics fetched successfully",
                analytics
            }
        )
    }
)

export const updateProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        const body = updateProjectSchema.parse(req.body);
        const { name, emoji, description } = body;
        // check role and permission of the user
        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.EDIT_PROJECT]);

        // update project
        const { project } = await updateProjectService(projectId, workspaceId, body);

        return res.status(HTTPSTATUS.OK).json({
            message: "project updated succcessfully",
            project
        })
    })

export const deleteProjectController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        // check role and permission of the user
        const { role } = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.DELETE_PROJECT]);

        await deleteProjectService(projectId, workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            message : "project and all tasks associated with have been deletedSuccessfully."
        })

    })
