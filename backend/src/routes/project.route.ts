import { Router } from "express";
import { createProjectController, deleteProjectController, getAllWorkspaceProjectController, getProjectAnalyticsController, getProjectByIdAndWorkspaceIdController, updateProjectController } from "../controllers/project.controller";


const projectRoute = Router();

projectRoute.post("/workspace/:workspaceId/create", createProjectController);
projectRoute.put("/:projectId/workspace/:workspaceId/update", updateProjectController);
projectRoute.delete("/:projectId/workspace/:workspaceId/delete", deleteProjectController);
projectRoute.get("/workspace/:workspaceId/all", getAllWorkspaceProjectController);
projectRoute.get("/:projectId/workspace/:workspaceId", getProjectByIdAndWorkspaceIdController)
projectRoute.get("/:projectId/workspace/:workspaceId/analytics" , getProjectAnalyticsController)
export default projectRoute;