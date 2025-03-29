import { Router } from "express";
import { createProjectController, getAllWorkspaceProjectController, getProjectAnalyticsController, getProjectByIdAndWorkspaceIdController } from "../controllers/project.controller";


const projectRoute = Router();

projectRoute.post("/workspace/:workspaceId/create", createProjectController);
projectRoute.put("/projectId/workspace/:workspaceId/update", updateProjectController);
projectRoute.get("/workspace/:workspaceId/all", getAllWorkspaceProjectController);
projectRoute.get("/:projectId/workspace/:workspaceId", getProjectByIdAndWorkspaceIdController)
projectRoute.get("/:projectId/workspace/:workspaceId/analytics" , getProjectAnalyticsController)
export default projectRoute;