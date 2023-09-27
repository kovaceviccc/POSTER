import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JobPost } from "./job-post.interface";
import { JobApplicationEntity } from "./job-application.entity";
import { UserEntity } from "src/user/user/models/user.entity";
import { JobTypeEnum } from "./job-type.enum";
import { add, addDays } from 'date-fns';

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

    @Column({type: 'enum', enum: JobTypeEnum, nullable: true})
    jobType: JobTypeEnum;

    @OneToMany(() => JobApplicationEntity, (jobApplication) => jobApplication.job)
    applications: JobApplicationEntity[];

    @ManyToOne(() => UserEntity, (user) => user.jobsCreated)
    createdBy?: UserEntity;

    @BeforeInsert()
    initializeEntity() {
        this.expired = false;
        this.postedAtUTC = new Date;
        this.expiresAtUTC = addDays(new Date(), 30);
    }
}