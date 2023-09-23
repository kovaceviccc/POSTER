import { User } from "src/user/user/models/user.interface";
import { JobApplication } from "./job-application.interface";
import { JobPost } from "./job-post.interface";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { type } from "os";
import { UserEntity } from "src/user/user/models/user.entity";
import { JobPostEntity } from "./job-post.entity";


@Entity('job_application')
export class JobApplicationEntity implements JobApplication {

    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => UserEntity, (user) => user.applications)
    applicant: UserEntity;

    @ManyToOne(() => JobPostEntity, (jobPost) => jobPost.applications)
    job: JobPostEntity;
}