import mongoose, { Document, Schema } from "mongoose";



export interface MemberDocument extends Document {
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    // role: RoleDocument 
    joinedAt: Date,
}

const memberSchema = new Schema<MemberDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // role: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Role",
    //     required: true,
    // },
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "WorkSpace",
        required: true,
    },
    joineAt: {
        type: Date,
        required: true
    }

})