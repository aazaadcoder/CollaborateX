import { Router } from "express";
import { createWorkspaceController, getAllUserWorkspacesUserIsMemberController } from "../controllers/workspace.controller";


const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);

// get all the workspaces the current user is part of
workspaceRoute.get("/all", getAllUserWorkspacesUserIsMemberController);



export default workspaceRoute;