import { PermissionType } from "../enums/role.enum";
import { UnauthorizedAccessException } from "./appError.util";
import { RolePermission } from "./role-persmission";

export const roleGaurd = (role : keyof typeof RolePermission, requiredPermissions : PermissionType[]) => {

    // get permission of the role 
    const permissions = RolePermission[role];

    // now check if permissions of the user role conatains all the requires permission

    const hasPermission = requiredPermissions.every((pemission) => permissions.includes(pemission));
    // will give false if anyone requiredPermission is not in permissions of the user role


    if(!hasPermission){
        throw new UnauthorizedAccessException("You donot have authrized access to perfrom this action ");
    }
} 