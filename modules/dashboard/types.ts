export interface User {
    id: string
    name: string
    email: string
    image: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export interface Project {
    id: string
    title: string
    description: string
    template: string
    createdAt: Date
    updatedAt: Date
    userId: string
    user: User
    Starmark: { isMarked: boolean }[]
}


export interface TemplateType {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "UNKNOWN";
    description?: string;
}

export interface CreateFromGithubParams {
    title: string;
    description?: string;
    templateData: any;
    framework: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "ANGULAR" | "HONO" | "UNKNOWN";
}