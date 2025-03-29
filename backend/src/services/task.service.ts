import mongoose from "mongoose";
import { TaskPriorityEnum, TaskPriorityEnumType, TaskstatusEnum, TaskstatusEnumType } from "../enums/task.enum";
import MemberModel from "../models/member.model";
import ProjectModel from "../models/project.model"
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/appError.util";
import WorkspaceModel from "../models/workspace.model";

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

    return { task };
}

export const getAllTasksService = async (workspaceId: string,
    filters: {
        projectId?: string;
        status?: string[];
        priority?: string[];
        assignedTo?: string[];
        keyword?: string;
        dueDate?: string;
    },
    pagination: {
        pageSize: number;
        pageNumber: number;
    }) => {

    // check if workspace exists 
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException("Workspace not found")
    }

    // if project id given check if exists
    if (filters.projectId) {
        const project = await ProjectModel.findById(filters.projectId);

        if (!project) {
            throw new NotFoundException("project not found")
        }
    }

    const query: Record<string, any> = {
        workspace: workspaceId
    };

    if (filters.projectId) {
        query.project = filters.projectId
    }

    if (filters.status && filters.status.length > 0) {
        query.status = { $in: filters.status }
        console.log(filters.status)
    }

    if (filters.priority && filters.priority.length > 0) {
        query.priority = { $in: filters.priority }
    }

    if (filters.assignedTo && filters.assignedTo.length > 0) {
        query.assignedTo = { $in: filters.assignedTo }
    }

    if (filters.keyword && filters.keyword != undefined) {
        query.title = { $regex: filters.keyword, $options: "i" }
    }

    if (filters.dueDate) {
        query.dueDate = { $eq: new Date(filters.dueDate) }
    }

    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;

    const [tasks, totalCount] = await Promise.all(
        [
            TaskModel
                .find(query)
                .skip(skip)
                .limit(pageSize)
                .sort({ createdAt: -1 })
                .populate("assignedTo", "_id profilePicture name -password")
                .populate("project", "_id name emoji"),
            TaskModel.countDocuments(query),
        ]
    )

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        tasks,
        pageination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip
        }


    };

}

export const getTaskByIdService = async (taskId: string, projectId: string, workspaceId: string) => {
    // check if project exists 
    const project = await ProjectModel.find({ _id: projectId, workspace: workspaceId });

    if (!project) {
        throw new NotFoundException("Project not found or does not belong to this workspace")
    }
    // check if task exists and belongs to propject and workspace

    const task = await TaskModel.findOne({ _id: taskId, workspace: workspaceId, project: projectId });

    if (!task) {
        throw new NotFoundException("Task not found or task doesnot belong to this project/workspace");
    }

    return { task };
}
export const deleteTaskService = async (taskId: string, projectId: string, workspaceId: string) => {
    // check if project exists 
    const project = await ProjectModel.find({ _id: projectId, workspace: workspaceId });

    if (!project) {
        throw new NotFoundException("Project not found or does not belong to this workspace")
    }
    // check if task exists and belongs to propject and workspace

    const task = await TaskModel.findOne({ _id: taskId, workspace: workspaceId, project: projectId });

    if (!task) {
        throw new NotFoundException("Task not found or task doesnot belong to this project/workspace");
    }

    await task.deleteOne();
    
}