
import mongoose, { Document, Schema } from "mongoose";
import { generateWorkSpaceInviteCode } from "../utils/uuid.util";


export interface WorkspaceDocument extends Document {
    name: string,
    description: string,
    owner: mongoose.Types.ObjectId,
    inviteCode: string,
    createdAt: string,
    updatedAt: string,
}

const workSpaceSchema = new Schema<WorkspaceDocument>(
    {
        name : {type : String , required : true , trim : true},
        description : {type: String , required: false },
        owner: {
            type: Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        inviteCode : {
            type: String,
            required: true, 
            unique: true, 
            default : generateWorkSpaceInviteCode,
        }
    },
    {timestamps: true}
); 


workSpaceSchema.methods.resetInviteCode = function(){
    this.inviteCode = generateWorkSpaceInviteCode();
};

const WorkspaceModel = mongoose.model<WorkspaceDocument>("Workspace", workSpaceSchema)

export default WorkspaceModel;