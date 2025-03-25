import { compareValue } from './../utils/bcrypt.util';
import mongoose, { Document, Schema } from "mongoose";
import { hashValue } from "../utils/bcrypt.util";


export interface UserDoccument extends Document {
    name: string;
    email: string;
    password?: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: mongoose.Types.ObjectId | null;
    comparePassword(value: string): Promise<boolean>
    omitPassword(): Omit<UserDoccument, "password">
}

const userSchema = new Schema<UserDoccument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        select: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    currentWorkspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspaces"
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null }

}, { timestamps: true });

userSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        if (this.password) {
            this.password = await hashValue(this.password)
        }
    }
    next();
})


userSchema.methods.omitPassword = function (): Omit<UserDoccument, 'password'> {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.methods.comparePassword = async function(value :string){
    return compareValue(value, this.password);
}

const UserModel = mongoose.model<UserDoccument>("User", userSchema);
export default UserModel;