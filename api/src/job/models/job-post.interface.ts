import { User } from "src/user/user/models/user.interface";
import { JobApplication } from "./job-application.interface";
import { JobTypeEnum } from "./job-type.enum";


export interface JobPost {

    id?: string;
    jobTitle?: string;
    jobDescription?: string;
    postedAtUTC?: Date;
    expiresAtUTC?: Date;
    expired?: boolean;
    applications?: JobApplication[];
    createdBy?: User;
    jobType?: JobTypeEnum;
}