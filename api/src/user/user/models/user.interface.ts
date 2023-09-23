import { BlogEntry } from "src/blog/model/blog-entry.interface";
import { JobApplication } from "src/job/models/job-application.interface";
import { JobPost } from "src/job/models/job-post.interface";

export interface User {

    id?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    passwordHash?: string;
    role?: UserRole;
    profileImage?: string;
    applications?: JobApplication[];
    jobsCreated?: JobPost[];
}

export enum UserRole {
    ADMIN = 'admin',
    JOBCREATOR = 'jobcreator',
    USER = 'user'
}
