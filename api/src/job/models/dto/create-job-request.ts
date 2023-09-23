import { User } from "src/user/user/models/user.interface";

export class CreateJobRequest {

    jobTitle: string;
    jobDescription: string;
    expiresAtUtc: Date;
}