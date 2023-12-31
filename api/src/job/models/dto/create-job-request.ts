import { JobTypeEnum } from "../job-type.enum";

export interface CreateJobRequest {
    jobTitle: string;
    jobDescription: string;
    jobLocation: string;
    jobType: JobTypeEnum
}