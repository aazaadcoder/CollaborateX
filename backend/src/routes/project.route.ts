import { Router } from "express";
import { createProjectController, getAllWorkspaceProjectController, getProjectByIdAndWorkspaceIdController } from "../controllers/project.controller";


const projectRoute = Router();

projectRoute.post("/workspace/:workspaceId/create", createProjectController);
projectRoute.get("/workspace/:workspaceId/all", getAllWorkspaceProjectController);
projectRoute.get("/:projectId/workspace/:workspaceId", getProjectByIdAndWorkspaceIdController)
export default projectRoute;