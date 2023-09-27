import { JobTypeEnum } from "./job-type.enum";

export interface CreateJobRequest {
    jobDescription: string;
    jobLocation: string;
    jobTitle: string;
    jobType: JobTypeEnum
}