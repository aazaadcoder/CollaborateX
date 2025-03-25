export const TaskstatusEnum = {
    BACKLOG : "BACKLOG",
    TODO : "TODO",
    IN_PROGRESS :"IN_PROGRESS",
    IN_REVIEW :"IN_REVIEW",
    DONE : "DONE"
} as const;

export const TaskPriorityEnum = {
    LOW : "LOW",
    MEDIUM : "MEDIUM",
    HIGH : "HIGH"
}  as const;

export type TaskstatusEnumType  = keyof typeof TaskstatusEnum;
export type TaskPriorityEnumType  = keyof typeof TaskPriorityEnum;
