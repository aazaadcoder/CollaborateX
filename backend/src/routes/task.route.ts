import { Router } from "express";
import { createTaskController, deleteTaskController, getAllTasksController, getTaskByIdController, updateTaskController } from "../controllers/task.controller";

const taskRoute = Router()

taskRoute.post("/project/:projectId/workspace/:workspaceId/create", createTaskController);
taskRoute.put("/:taskId/project/:projectId/workspace/:workspaceId/update", updateTaskController);
taskRoute.get("/workspace/:workspaceId/all", getAllTasksController);
taskRoute.get("/:taskId/project/:projectId/workspace/:workspaceId", getTaskByIdController);
taskRoute.delete("/:taskId/project/:projectId/workspace/:workspaceId/delete", deleteTaskController)


export default taskRoute;