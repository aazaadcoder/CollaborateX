import { Router } from "express";
import { createWorkspaceController, getAllUserWorkspacesUserIsMemberController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController } from "../controllers/workspace.controller";


const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);

// get all the workspaces the current user is part of
workspaceRoute.get("/all", getAllUserWorkspacesUserIsMemberController);

// get workspace by its id 
workspaceRoute.get("/:workspaceId", getWorkspaceByIdController);

// get all workspace members 
workspaceRoute.get("/members/:workspaceId", getWorkspaceMembersController);

// get workspace analytics like number of completed task , due tasks etc 
workspaceRoute.get("/analytics/:workspaceId",getWorkspaceAnalyticsController);
export default workspaceRoute;