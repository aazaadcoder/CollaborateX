import {v4 as uuidv4} from "uuid";
 
export function generateWorkSpaceInviteCode(){
    return uuidv4().replace(/-/g, "").substring(0,8);
    // here we generate a 8 character invite code using uuid and we replace all - with "" using regex notation in replace fucntion 
}

export function generateTaskCode(){
    return `task-${uuidv4().replace(/-/g, "").substring(0,5)}`

    // todo : Modify generateTaskCode() to ensure uniqueness before inserting.
}