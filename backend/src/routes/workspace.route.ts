import { Router } from "express";
import { createWorkspaceController, getAllUserWorkspacesUserIsMemberController, getWorkspaceByIdController, getWorkspaceMembersController } from "../controllers/workspace.controller";


const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);

// get all the workspaces the current user is part of
workspaceRoute.get("/all", getAllUserWorkspacesUserIsMemberController);

// get workspace by its id 
workspaceRoute.get("/:workspaceId", getWorkspaceByIdController);

// get all workspace members 
workspaceRoute.get("/members/:workspaceId", getWorkspaceMembersController);

export default workspaceRoute;