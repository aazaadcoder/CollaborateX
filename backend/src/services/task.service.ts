import mongoose from "mongoose";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskstatusEnum, TaskstatusEnumType } from "../enums/task.enum";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model"
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/appError.util";

export const createTaskService = async (userId: string, workspaceId: string, projectId: string,
    body: {
        title: string,
        description?: string,
        priority: string,
        status: string,
        assignedTo?: string | null,
        dueDate?: string,
    }) => {

    // check if project exists in the workspace
    const project = await ProjectModel.findOne({ _id: projectId, workspace: workspaceId });

    if (!project) {
        throw new NotFoundException("Project/workspace not found");
    }


    if (body.assignedTo) {
        // check if the assigneduser is part of the workspace 
        const member = await MemberModel.findOne({ userId: body.assignedTo, workspaceId });

        if (!member) {
            throw new Error("Assigned user is not part of the workspace");
        }
    }

    const task = new TaskModel(
        {
            title: body.title,
            description: body.description,
            priority: body.priority || TaskPriorityEnum.MEDIUM,
            status: body.status || TaskstatusEnum.TODO,
            assignedTo: body.assignedTo,
            dueDate: body.dueDate,
            createdBy: userId,
            workspace: workspaceId,
            project: projectId,

        }
    )

    await task.save();

    return { task };

}



export const updateTaskService = async (userId: string, workspaceId: string, projectId: string, taskId: string,
    body: {
        title?: string,
        description?: string,
        priority?: string,
        status?: string,
        assignedTo?: string | null,
        dueDate?: string,
    }) => {


    // check if project and workspace exist

    const project = await ProjectModel.findOne({ _id: projectId, workspace: workspaceId });

    if (!project) {
        throw new NotFoundException("Project not found or does not belong to this workspace");
    }

    const task = await TaskModel.findOne({ project: projectId, workspace: workspaceId });

    if (!task) {
        throw new NotFoundException("Task not found or does not belof to this project/workspace");
    }

    task.title = body.title ?? task.title;
    task.description = body.description ?? task.description;
    task.priority = (body.priority ?? task.priority) as TaskPriorityEnumType;
    task.status = (body.status ?? task.status) as TaskstatusEnumType;
    task.assignedTo = (body.assignedTo ?? task.assignedTo) as mongoose.Types.ObjectId;
    task.dueDate = (body.dueDate ?? task.dueDate) as Date;

    await task.save();

    return {task};



}