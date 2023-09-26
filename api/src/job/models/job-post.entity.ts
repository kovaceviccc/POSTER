import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobPost } from "./job-post.interface";
import { JobApplicationEntity } from "./job-application.entity";
import { User } from "src/user/user/models/user.interface";
import { UserEntity } from "src/user/user/models/user.entity";
import { JobPostDetails } from "./dto/job-post-details";


@Entity('job_post')
export class JobPostEntity implements JobPost {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    jobTitle: string;

    @Column()
    jobDescription: string;

    @Column({ type: 'timestamp' })
    postedAtUTC: Date;

    @Column({ type: 'timestamp' })
    expiresAtUTC: Date;

    @Column({ type: 'boolean' })
    expired: boolean;

    @OneToMany(() => JobApplicationEntity, (jobApplication) => jobApplication.job)
    applications: JobApplicationEntity[];

    @ManyToOne(() => UserEntity, (user) => user.jobsCreated)
    createdBy?: UserEntity;

    @BeforeInsert()
    initializeEntity() {
        this.expired = false;
        this.postedAtUTC = new Date;

    }
}