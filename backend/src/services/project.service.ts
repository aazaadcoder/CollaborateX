import mongoose from "mongoose";
import { TaskstatusEnum } from "../enums/task.enum";
import ProjectModel from "../models/project.model"
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/appError.util";

export const createProjectService = async (workspaceId: string, userId: string, body: { emoji?: string, name: string, description?: string }) => {
    // create project 
    const project = new ProjectModel(
        {
            name: body.name,
            // emoji : body.emoji || null,
            ...(body.emoji && { emoji: body.emoji }),
            description: body.description || null,
            createdBy: userId,
            workspace: workspaceId,
        }
    )

    await project.save();

    return { project }
}


export const getAllWorkspaceProjectService = async (workspaceId: string, pageSize: number, pageNumber: number) => {

    // get the total number of projects in the workspace

    const totalProjects = await ProjectModel.countDocuments({ workspace: workspaceId });

    const skip = (pageNumber - 1) * pageSize;

    // get paginated projects in desceding order of date created 
    const projects = await ProjectModel.find({ workspace: workspaceId }).skip(skip).limit(pageSize).populate("createdBy", "_id name profilePicture -password").sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalProjects / pageSize);
    return { projects, totalProjects, totalPages, skip };
}

export const getProjectByIdAndWorkspaceIdService = async (projectId: string, workspaceId: string) => {

    const project = await ProjectModel.findOne({ _id: projectId, workspace: workspaceId }).select("_id emoji name description");

    if (!project) {
        throw new NotFoundException("Project not found or doesnot belog to specified workspace ")
    }

    return { project }
}


export const getProjectAnalyticService = async (projectId: string, workspaceId: string) => {
    // check if project exist 
    const project = await ProjectModel.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) {
        throw new NotFoundException("Project Not found or doesnot belong to the workspace provided ");
    }


    const currentDate = new Date();

    // // get total tasks
    // const totalTasks = await TaskModel.countDocuments({project : projectId, workspace : workspaceId});


    // // get overdue tasks
    // const overdueTasks = await TaskModel.countDocuments(
    //     {project : projectId,
    //      workspace : workspaceId,
    //     dueDate : {$lt : currentDate},
    //     status : {$ne : TaskstatusEnum.DONE}
    //     });


    // // GET done tasks
    // const completedTasks = await TaskModel.countDocuments(
    //     {
    //         project : projectId,
    //         workspace : workspaceId,
    //         status : {$eq : TaskstatusEnum.DONE}
    //     })


    /* lets use agregation pipelines this time */

    const taskAnalytics = await TaskModel.aggregate(
        [
            {
                $match: {
                    project: projectId,
                    workspace: workspaceId,
                }
            },
            {
                $facet: {
                    totalTasks: [{ $count: "count" }],
                    overdueTasks:
                        [
                            {
                                $match: {
                                    dueDate: { $lt: currentDate },
                                    status: { $ne: TaskstatusEnum.DONE }
                                }
                            },
                            {
                                $count: "count"
                            }

                        ],
                    completedTasks:
                        [
                            {
                                $match: {
                                    status: { $eq: TaskstatusEnum.DONE }
                                }
                            },
                            {
                                $count: "count"
                            }
                        ]
                }
            }
        ]
    )

    const _analytics = taskAnalytics[0];

    const analytics = {
        totalTasks: _analytics.totalTasks[0]?.count || 0,
        overdueTasks: _analytics.overdueTasks[0]?.count || 0,
        completedTasks: _analytics.completedTasks[0]?.count || 0,
    }
    return { analytics }


}

export const updateProjectService = async (projectId: string, workspaceId: string,
    body: {
        name?: string,
        emoji?: string,
        description?: string
    }) => {
    // check if project in workspace exist 
    const project = await ProjectModel.findOne({ _id: projectId, workspace: workspaceId });

    if (!project) {
        throw new NotFoundException("Project not found or project not found in workspace");
    }

    // upadate body in project model

    project.name = body.name || project.name;
    project.emoji = body.emoji || project.emoji;
    project.description = body.description || project.description;

    await project.save();

    return { project };
}

export const deleteProjectService = async (projectId: string, workspaceId: string) => {

    /*
    1. delete all the tasks assosiaated with the project 
    2. delete the project 
    3. so we will use transactions
    */

    const session = await mongoose.startSession();

    try {
        await session.startTransaction();

        // check if project in workspace exist 
        const project = await ProjectModel.findOne({ _id: projectId, workspace: workspaceId }).session(session);

        if (!project) {
            throw new NotFoundException("Project not found or project not found in workspace");
        }

        // delete all tasks
        await TaskModel.deleteMany({project: projectId , workspace : workspaceId}).session(session);

        // delete the project
        await project.deleteOne().session(session);

        await session.commitTransaction();

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }



}