import { RoleDocument } from './role-permission.model';
import { Permissions, PermissionType, Roles } from './../enums/role.enum';
import { RoleType } from "../enums/role.enum";
import { Schema } from 'mongoose';
import { object } from 'zod';
import { RolePermission } from '../utils/role-persmission';


export interface RoleDocument extends Document {
    name: RoleType,
    permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required : true,
            unique : true,
            
        },
        permissions: {
            type : [String],
            enum : Object.values(Permissions),
            required : true,
            default : function (this: RoleDocument) {
                return RolePermission[this.name]
            }
        }
    },
    {
        timestamps: true
    }
)