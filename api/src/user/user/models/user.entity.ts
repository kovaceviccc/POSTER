import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User, UserRole } from "./user.interface";
import { BlogEntryEntity } from "src/blog/model/blog-entry.entity";
import { JobApplicationEntity } from "src/job/models/job-application.entity";
import { JobApplication } from "src/job/models/job-application.interface";
import { JobPostEntity } from "src/job/models/job-post.entity";
import { JobPost } from "src/job/models/job-post.interface";

@Entity()
export class UserEntity implements User {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ unique: true, nullable: true })
    profileImage: string;

    @OneToMany(() => JobApplicationEntity, (jobApplication) => jobApplication.applicant)
    applications: JobApplicationEntity[];

    @OneToMany(() => JobPostEntity, (jobPost) => jobPost.createdBy)
    jobsCreated?: JobPostEntity[];

    @BeforeInsert()
    emailToLowwerCase() {
        this.email = this.email.toLowerCase();
    }
}
