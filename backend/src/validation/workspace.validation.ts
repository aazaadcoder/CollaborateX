import { z } from "zod";

export const nameSchema = z.string().trim().min(1, "Workspace Name is required").max(255);
export const descriptionSchema = z.string().trim().optional(); 
export const workspaceIdSchema = z.string().trim().min(1, "workspace id required")


export const createWorkspaceSchema = z.object({
    name : nameSchema,
    description : descriptionSchema,
})

export const updateWorkspaceSchema = z.object({
    name : nameSchema, 
    description : descriptionSchema ,
})