import ProjectModel from "../models/project.model"

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
    const projects = await ProjectModel.find({ workspace: workspaceId }).skip(skip).limit(pageSize).populate("createdBy", "_id name profilePicture -password").sort({createdAt : -1});

    const totalPages = Math.ceil(totalProjects/pageSize);
    return { projects,  totalProjects, totalPages, skip };
}