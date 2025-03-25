import mongoose, { Schema } from "mongoose";

export interface ProjectDocumnet extends Document {
    name: String,
    description: string | null,
    emoji: string,
    workspace: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

const projectSchema = new Schema<ProjectDocumnet>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        emoji: {
            type: String,
            required: true,
            trim: true,
            default: "📊"
        },
        description: {
            type: String,
            required: false

        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }


    },
    {timestamps : true}
)

const  ProjectModel = mongoose.model<ProjectDocumnet>("Project", projectSchema);

export default ProjectModel;