import { Permissions, PermissionType, Roles } from './../enums/role.enum';
import { RoleType } from "../enums/role.enum";
import mongoose, { Schema } from 'mongoose';
import { RolePermission } from '../utils/role-persmission';


export interface RoleDocument extends Document {
    name: RoleType,
    permissions: Array<PermissionType>;
}
// here we define a custom object type using and Document class and few extra fields 

// now we will create a schema with RoleDocument as it type, and schema must follow it 
const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required: true,
            unique: true,

        },
        permissions: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RoleDocument) {
                return RolePermission[this.name]
            }
        }
    },
    {
        timestamps: true
    }
)

const RoleModel = mongoose.model("Role", roleSchema);
export default RoleModel;