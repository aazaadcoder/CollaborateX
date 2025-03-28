import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/aynscHandler.middleware";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { createProjectSchema, projectIdSchema } from "../validation/project.validation";
import { getMemberRoleInWorkspaceService } from "../services/member.service";
import { roleGaurd } from "../utils/roleGuard.util";
import { Permissions } from "../enums/role.enum";
import { createProjectService, getAllWorkspaceProjectService, getProjectByIdAndWorkspaceIdService } from "../services/project.service";
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
            message : "project created successfully",
            projects,
            pagination : {
                totalProjects,
                totalPages,
                pageNumber,
                pageSize,
                skip, 
                limit : pageSize,
            }
        })
    }
)

export const getProjectByIdAndWorkspaceIdController = asyncHandler(
    async (req: Request , res :Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const projectId = projectIdSchema.parse(req.params.projectId);

        const userId = req.user?._id;

        const {role} = await getMemberRoleInWorkspaceService(userId, workspaceId);
        roleGaurd(role, [Permissions.VIEW_ONLY]);

        const {project} = await getProjectByIdAndWorkspaceIdService(userId, workspaceId);


        return res.status(HTTPSTATUS.OK).json({
            message : "project fetched succesfully",
            project
        })
    }
)