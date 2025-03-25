import mongoose, { Document, Schema } from "mongoose";
import { ProvideEnum, ProvideEnumTypes } from "../enums/account.provider";
import { string } from "zod";
import { timeStamp } from "node:console";



export interface AccountDocumnet extends Document {
    provider: ProvideEnumTypes;
    providerId: string; // to store email , phone, gopgle id
    userId: mongoose.Types.ObjectId;
    refreshToken: string | null;
    tokenExpiry: Date | null;
}

const accountSchema = new Schema<AccountDocumnet>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    provider: {
        type: String,
        enum: Object.values(ProvideEnum),
        required: true,
    },
    providerId: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: { type: Boolean, default: null },
    tokenExpiry: { type: Date, default: null }
},
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.refreshToken;  // remove refresh token from the json response 
            },
        },
    })

const accountModel = mongoose.model<AccountDocumnet>("Account", accountSchema)

export default accountModel;
