import { Router } from "express";
import { createProjectController, getAllWorkspaceProjectController } from "../controllers/project.controller";


const projectRoute = Router();

projectRoute.post("/workspace/:workspaceId/create", createProjectController);
projectRoute.get("/workspace/:workspaceId/all", getAllWorkspaceProjectController);

export default projectRoute;