import { TaskPriorityEnum, TaskstatusEnumType } from './../enums/task.enum';
import mongoose, { Document, Schema } from "mongoose";
import { TaskPriorityEnumType, TaskstatusEnum } from "../enums/task.enum";
import { string } from "zod";
import { generateTaskCode } from '../utils/uuid.util';


export interface TaskDocument extends Document {
    taskCode: string;
    title: string;
    description: string | null;
    project: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    status: TaskstatusEnumType;
    priority: TaskPriorityEnumType;
    assignedTo: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
    {
        taskCode: {
            type: String,
            unique: true,
            default: generateTaskCode,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default : null,
            trim : true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true

        },
        status: {
            type: String,
            enum: Object.values(TaskstatusEnum),
            default: TaskstatusEnum.TODO,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriorityEnum),
            default: TaskPriorityEnum.MEDIUM,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dueDate: {
            type: Date,
            default: null,

        }


    },
    {
        timestamps: true
    }
)

const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema)

export default TaskModel;