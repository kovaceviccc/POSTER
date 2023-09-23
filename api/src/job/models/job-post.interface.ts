import { User } from "src/user/user/models/user.interface";
import { JobApplication } from "./job-application.interface";


export interface JobPost {

    id?: string;
    jobTitle?: string;
    jobDescription?: string;
    postedAtUtc?: Date;
    expiresAtUtC?: Date;
    expired?: boolean;
    applications?: JobApplication[];
    createdBy?: User;
}