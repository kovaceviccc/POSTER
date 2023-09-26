import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Observable, of, switchMap, from, map, catchError } from 'rxjs';
import { CreateJobRequest } from 'src/job/models/dto/create-job-request';
import { JobPostEntity } from 'src/job/models/job-post.entity';
import { JobPost } from 'src/job/models/job-post.interface';
import { UserEntity } from 'src/user/user/models/user.entity';
import { User } from 'src/user/user/models/user.interface';
import { UserService } from 'src/user/user/service/user.service';
import { Like, Repository, SelectQueryBuilder } from 'typeorm';
import { JobApplicationEntity } from '../models/job-application.entity';
import { OperationResponse } from 'src/dto/outgoing';
import { JobPostDetails } from '../models/dto/job-post-details';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(JobPostEntity) private readonly jobPostRepository: Repository<JobPostEntity>,
        @InjectRepository(JobApplicationEntity) private readonly jobApplicationRepository: Repository<JobApplicationEntity>,
        private readonly userService: UserService
    ) { }

    createJob(createJobRequest: CreateJobRequest, creatorId: string): Observable<boolean> {

        if (createJobRequest === null) return of(false);

        const creator = this.userService.findOne(creatorId).pipe(
            switchMap((result: User) => {
                return of(result)
            })
        );

        if (creator === null) return of(false);

        return from(this.userService.findOne(creatorId)).pipe(
            switchMap((creator: UserEntity) => {
                if (creator === null) return of(false);
                const job = this.mapDTO(createJobRequest, creator);
                return from(this.jobPostRepository.save(job)).pipe(
                    map((result: JobPostEntity) => {
                        return result !== null;
                    })
                );
            })
        );
    }

    paginateFilterByTitle(options: IPaginationOptions, title: string): Observable<Pagination<JobPost>> {

        return from(this.jobPostRepository.findAndCount(
            {
                skip: (Number(options.page)) * Number(options.limit) || 0,
                take: (Number(options.limit)) || 10,
                order: {
                    id: "ASC",
                },
                select: ['id', 'createdBy', 'applications', 'expiresAtUTC', 'jobTitle', 'jobDescription'],
                where: [
                    { jobTitle: Like(`%${title}`) }
                ]
            }
        )).pipe(
            map(([jobs, totalJobs]) => {

                const jobsPageable: Pagination<JobPost> = {
                    items: jobs,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + '',
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalJobs / Number(options.page))}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: jobs.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalJobs,
                        totalPages: Math.ceil(totalJobs / Number(options.limit))
                    }
                };
                return jobsPageable;
            })
        );
    }

    paginateJobs(options: IPaginationOptions): Observable<Pagination<JobPostDetails>> {
        return from(paginate<JobPostEntity>(this.jobPostRepository, options, {
            relations: ['applications', 'createdBy', 'createdBy.jobsCreated'],
            order: { postedAtUTC: 'DESC' }
        })).pipe(
            map((jobs: Pagination<JobPostEntity>) => {
                return {
                    items: this.Map(jobs.items),
                    links: jobs.links,
                    meta: jobs.meta
                };
            })
        );
    }

    getById(jobId: string): Observable<JobPostDetails> {
        return from(
            this.jobPostRepository
                .createQueryBuilder('jobPost')
                .addSelect('jobPost.id', 'id')
                .addSelect('jobPost.jobTitle', 'jobTitle')
                .addSelect('jobPost.jobDescription', 'jobDescription')
                .addSelect('jobPost.postedAtUTC', 'postedAtUTC')
                .addSelect('COUNT(DISTINCT  application.id)', 'applicationsCount')
                .leftJoin('jobPost.applications', 'application')
                .addSelect('user.firstName', 'creatorFirstName')
                .addSelect('user.lastName', 'creatorLastName')
                .addSelect('COUNT(DISTINCT  jobsCreated.id)', 'jobsByCreatorCount')
                .leftJoin('jobPost.createdBy', 'user')
                .leftJoin('user.jobsCreated', 'jobsCreated')
                .where('jobPost.id = :jobId', { jobId })
                .groupBy('jobPost.id, user.firstName, user.lastName')
                .getRawOne(),
        ).pipe(
            map((result) => {
                return {
                    id: result.id,
                    jobTitle: result.jobTitle,
                    jobDescription: result.jobDescription,
                    postedAtUTC: result.postedAtUTC,
                    applicationsCount: result.applicationsCount || 0,
                    creatorName: `${result.creatorFirstName} ${result.creatorLastName}`,
                    jobsByCreatorCount: result.jobsByCreatorCount || 0,

                }
            }),
        );
    }


    getJobsByCreatorId(creatorId: string): Observable<JobPost[]> {
        return from(this.userService.findOne(creatorId)).pipe(
            map((result: User) => {
                return result.jobsCreated;
            })
        );

    }

    applyForJob(jobId: string, user: UserEntity, cvFilePath: string): Observable<OperationResponse> {
        return from(this.jobPostRepository.findOne({ where: { id: jobId }, relations: ['applications', 'applications.applicant', 'createdBy'] })).pipe(
            switchMap((job: JobPostEntity) => {
                if (!job) return of({
                    success: false,
                    message: 'Job does not exist'
                });

                if (job.createdBy.id === user.id) {
                    return of({
                        message: "Job creator cannot apply for the job he created",
                        success: false
                    });
                }
                //check if the application already exists
                const existingApplication = job.applications.find(
                    (application) => application.applicant.id === user.id
                );

                if (existingApplication) return of({
                    success: false,
                    message: 'Application already exists'
                });

                const application: JobApplicationEntity = new JobApplicationEntity();
                application.applicant = user;
                application.job = job;
                application.cvPath = cvFilePath;

                return from(this.jobApplicationRepository.save(application)).pipe(
                    map(() => {
                        return {
                            success: true,
                            message: 'Success'
                        };
                    }),
                    catchError((error) => {
                        console.log('Error occured while saving application: ', error);
                        return of({ success: false, message: 'error occured while processing request' });
                    })
                );
            })
        );
    }

    getAllApplications(jobId: string): Observable<JobApplicationEntity[]> {

        if (jobId === null || jobId === undefined) return of(new Array<JobApplicationEntity>());

        return from(
            this.jobApplicationRepository
                .createQueryBuilder('application')
                .where('job.id = :jobId', { jobId })
                .innerJoinAndSelect('application.job', 'job')
                .innerJoinAndSelect('application.applicant', 'applicant')
                .getMany()
        ).pipe(
            map((applications) => {

                applications.forEach(element => {
                    delete element.applicant.passwordHash;
                });

                return applications;
            }),
            catchError((error) => {
                console.log(error);
                throw error;
            })
        );
    }

    private mapDTO(createJobRequest: CreateJobRequest, creator: UserEntity): JobPostEntity {

        const result: JobPostEntity = new JobPostEntity();
        result.jobTitle = createJobRequest.jobTitle;
        result.jobDescription = createJobRequest.jobDescription;
        result.expiresAtUTC = createJobRequest.expiresAtUtc;
        result.createdBy = creator;
        return result;
    }

    private Map(jobPosts: JobPostEntity[]): JobPostDetails[] {
        return jobPosts.map((jobPost) => {
            const {
                id,
                jobTitle,
                jobDescription,
                postedAtUTC,
                applications,
                createdBy,
            } = jobPost;

            const applicationsCount = applications.length;
            const { firstName, lastName, jobsCreated } = createdBy;
            const jobsByCreatorCount = jobsCreated.length;

            return {
                id,
                jobTitle,
                jobDescription,
                postedAtUTC,
                applicationsCount,
                creatorName: `${firstName} ${lastName}`,
                jobsByCreatorCount,
                creatorId: createdBy.id
            };
        });

    }
}


// const queryBuilder = 
        // this.jobPostRepository
        // .createQueryBuilder('jobPost')
        // .addSelect('jobPost.id', 'id')
        // .addSelect('jobPost.jobTitle', 'jobTitle')
        // .addSelect('jobPost.jobDescription', 'jobDescription')
        // .addSelect('jobPost.postedAtUTC', 'postedAtUTC')
        // .addSelect('COUNT(DISTINCT  application.id)', 'applicationsCount')
        // .leftJoin('jobPost.applications', 'application')
        // .addSelect('user.firstName', 'creatorFirstName')
        // .addSelect('user.lastName', 'creatorLastName')
        // .addSelect('user.id', 'creatorId')
        // .addSelect('COUNT(DISTINCT  jobsCreated.id)', 'jobsByCreatorCount')
        // .leftJoin('jobPost.createdBy', 'user')
        // .leftJoin('user.jobsCreated', 'jobsCreated')
        // .groupBy('jobPost.id, user.firstName, user.lastName, user.id') as SelectQueryBuilder<JobPostDetails>;


        // return from(paginate<JobPostDetails>(queryBuilder, options)).pipe(
        //     map((job: Pagination<JobPostDetails>) => {
        //         console.log(job.items);
        //         return job;
        //     })
        // )

        // return from(queryBuilder.getRawMany()).pipe(
        //     map((jobs, totalJobs) => {
                
        //         const jobsPageable: Pagination<JobPostDetails> = {
        //             items: jobs,
        //             links: {
        //                 first: options.route + `?limit=${options.limit}`,
        //                 previous: options.route + '',
        //                 next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
        //                 last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalJobs / Number(options.page))}`
        //             },
        //             meta: {
        //                 currentPage: Number(options.page),
        //                 itemCount: jobs.length,
        //                 itemsPerPage: Number(options.limit),
        //                 totalItems: totalJobs,
        //                 totalPages: Math.ceil(totalJobs / Number(options.limit))
        //             }
        //         };
        //         return jobsPageable;
        //     })
        // );

