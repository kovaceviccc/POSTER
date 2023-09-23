import { User } from "src/user/user/models/user.interface";
import { JobPost } from "./job-post.interface";

export interface JobApplication {

    id: string;
    applicant: User;
    job: JobPost;
}