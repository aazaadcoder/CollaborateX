import { Router } from "express";
import { createWorkspaceController } from "../controllers/workspace.controller";


const workspaceRoute = Router();

workspaceRoute.post("/create", createWorkspaceController);



export default workspaceRoute;