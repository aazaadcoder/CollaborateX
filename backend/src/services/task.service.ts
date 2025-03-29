import { TaskPriorityEnum, TaskstatusEnum } from "../enums/task.enum";
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

    
    if(body.assignedTo){
        // check if the assigneduser is part of the workspace 
        const member = await MemberModel.findOne({userId : body.assignedTo, workspaceId});

        if(!member){
            throw new Error("Assigned user is not part of the workspace");
        }
    }

    const task = new TaskModel(
        {
            title: body.title,
            description : body.description,
            priority : body.priority || TaskPriorityEnum.MEDIUM,
            status : body.status || TaskstatusEnum.TODO,
            assignedTo : body.assignedTo,
            dueDate : body.dueDate,
            createdBy : userId,
            workspace: workspaceId,
            project : projectId,

        }
    )

    await task.save();

    return {task};

}