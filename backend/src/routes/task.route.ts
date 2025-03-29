import { Router } from "express";
import { createTaskController, updateTaskController } from "../controllers/task.controller";

const taskRoute = Router()

taskRoute.post("/project/:projectId/workspace/:workspaceId/create", createTaskController);
taskRoute.put("/:taskId/project/:projectId/workspace/:workspaceId/update", updateTaskController);


export default taskRoute;