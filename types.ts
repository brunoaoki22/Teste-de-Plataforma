// types.ts
export type UserRole = 'Admin' | 'Membro';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    password: string;
    role: UserRole;
    avatarUrl: string;
    email: string;
    age: number | null;
    city: string;
}

export interface Client {
    id: string;
    name: string;
}

export interface Comment {
    id: string;
    author: User;
    timestamp: string;
    content: string;
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export type AttachmentType = 'image' | 'document' | 'video' | 'archive';

export interface Attachment {
    id: string;
    name: string;
    type: AttachmentType;
    url: string;
    size: number; // in bytes
}

export interface CustomStatus {
    id: string;
    name: string;
    color: string;
}

export type Priority = 'Baixa' | 'Média' | 'Alta';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: CustomStatus;
    priority: Priority;
    assignees: User[];
    dueDate: string | null;
    client: Client;
    creatorId: string;
    originalCreator?: User;
    comments: Comment[];
    subtasks: Subtask[];
    attachments: Attachment[];
    kanbanOrder: number;
    kanbanColumn: string;
}

export interface AppData {
    users: User[];
    tasks: Task[];
    clients: Client[];
    customStatuses: CustomStatus[];
}
