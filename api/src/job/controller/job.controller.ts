import { Body, Controller, Get, HttpStatus, Param, Post, Res, Request, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateJobRequest } from 'src/job/models/dto/create-job-request';
import { Response } from 'express';
import { Observable, catchError, from, map, of } from 'rxjs';
import { JobService } from '../service/job.service';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { User, UserRole } from 'src/user/user/models/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsPDF } from 'src/const';
import { UserEntity } from 'src/user/user/models/user.entity';
import { JobPostDetails } from '../models/dto/job-post-details';


@Controller('job')
export class JobController {

    constructor(private readonly jobService: JobService) {

    }

    @hasRoles(UserRole.JOBCREATOR)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post("create")
    createJob(
        @Body() job: CreateJobRequest,
        @Request() req,
        @Res() res: Response) {
        const jobCreator = req.user;
        if (jobCreator === null || jobCreator === undefined) return res.status(HttpStatus.UNAUTHORIZED).send();

        const isValid = true;
        if (!isValid) return res.status(HttpStatus.BAD_REQUEST).send();

        return this.jobService.createJob(job, jobCreator.id).pipe(
            map((result: boolean) => {
                const status = result ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR;
                return res.status(status).send();
            })
        );
    }

    @Get(':jobPostId')
    getById(@Param('jobPostId') jobPostId: string, @Res() res: Response) {

        if (jobPostId === null) return res.status(HttpStatus.BAD_REQUEST).send();

        return this.jobService.getById(jobPostId).pipe(
            map((result) => {
                if (result === null) return res.status(HttpStatus.NOT_FOUND).send();

                return res.status(HttpStatus.OK).send(result);
            })
        );
    }

    @Get('getAll')
    @hasRoles(UserRole.JOBCREATOR)
    @UseGuards(JwtAuthGuard, RolesGuard)
    getJobsPosted(@Request() req, @Res() res: Response) {

        const userId = req.user.id;
        return this.jobService.getJobsByCreatorId(userId).pipe(
            map((result) => {
                const status = result ? HttpStatus.NOT_FOUND : HttpStatus.OK
                return res.status(status).send(result);
            })
        );
    }

    @Get()
    paginate(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('jobTitle') jobTitle: string): Observable<Pagination<JobPostDetails>> {

        limit = limit > 100 ? 100 : limit;
        console.log("success");

        if (jobTitle === null || jobTitle === undefined) {
            return this.jobService.paginateJobs({ page, limit, route: 'http://localhost/3000/jobs/paginate' });
        }

        //return this.jobService.paginateFilterByTitle({ page, limit, route: 'http://localhost/3000/jobs/paginate' }, jobTitle);
    }

    @Get('applications/:jobId')
    @UseGuards(JwtAuthGuard)
    getApplicationsForJob(@Param('jobId') jobId: string, @Request() req, @Res() res: Response) {

        if (jobId === null || jobId === undefined) return res.status(HttpStatus.BAD_REQUEST);

        return from(this.jobService.getAllApplications(jobId)).pipe(
            map((result) => {
                const status = result ? HttpStatus.ACCEPTED : HttpStatus.INTERNAL_SERVER_ERROR;
                return res.status(status).send(result);
            })
        );
    }

    // @Post('apply/:jobId')
    // @UseGuards(JwtAuthGuard)
    // applyForJob(@Param('jobId') jobId: string, @Request() req, @Res() res: Response) {

    //     return this.jobService.applyForJob(jobId, req.user).pipe(
    //         map((result: OperationResponse) => {

    //             console.log()

    //             if (result.success) return res.status(HttpStatus.CREATED).send("Created a job application");
    //             return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result.message);
    //         })
    //     );
    // }

    @Post('apply/:jobId')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', multerOptionsPDF))
    applyForJob(
        @UploadedFile() file: Express.Multer.File ,
        @Param('jobId') jobId:string,
        @Body() coverLetter: string,
        @Request() req,
        @Res() res: Response) : Observable<Response>{

        if(file === null || file === undefined)
            return of(res.status(HttpStatus.BAD_REQUEST).send("CV is missing"));

        const user: UserEntity = req.user;

        return this.jobService.applyForJob(jobId, user, file.filename).pipe(
            map((result) => {
                const status = result.success ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
                return res.status(status).send(result);
            }),
            catchError((error) => {
                return of(res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error));
            })
        )

    }

}
