import { Router } from "express";
import {  changeMemberRoleController, createWorkspaceController, getAllUserWorkspacesUserIsMemberController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspaceController } from "../controllers/workspace.controller";


const workspaceRoute = Router();

workspaceRoute.post("/create/new", createWorkspaceController);

// to update the workspace
workspaceRoute.put("/update/:workspaceId", updateWorkspaceController)


// get all the workspaces the current user is part of
workspaceRoute.get("/all", getAllUserWorkspacesUserIsMemberController);

// get workspace by its id 
workspaceRoute.get("/:workspaceId", getWorkspaceByIdController);

// get all workspace members 
workspaceRoute.get("/members/:workspaceId", getWorkspaceMembersController);
// todo : an error of string ovjectid conversion coming if something other than object id is passed in place of workspace id

// get workspace analytics like number of completed task , due tasks etc 
workspaceRoute.get("/analytics/:workspaceId",getWorkspaceAnalyticsController);

// change/put the role of a member in workspace
workspaceRoute.put("/change/member/role/:workspaceId", changeMemberRoleController);













export default workspaceRoute;