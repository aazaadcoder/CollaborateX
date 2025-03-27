import { Router } from "express";
import { createWorkspaceController, getAllUserWorkspacesUserIsMemberController, getWorkspaceByIdController } from "../controllers/workspace.controller";


const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);

// get all the workspaces the current user is part of
workspaceRoute.get("/all", getAllUserWorkspacesUserIsMemberController);

// get workspace by its id 
workspaceRoute.get("/:workspaceId", getWorkspaceByIdController);



export default workspaceRoute;