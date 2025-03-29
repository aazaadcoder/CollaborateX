import { Router } from "express";
import { createTaskController, getAllTasksController, updateTaskController } from "../controllers/task.controller";

const taskRoute = Router()

taskRoute.post("/project/:projectId/workspace/:workspaceId/create", createTaskController);
taskRoute.put("/:taskId/project/:projectId/workspace/:workspaceId/update", updateTaskController);
taskRoute.get("/workspace/:workspaceId/all", getAllTasksController)


export default taskRoute;