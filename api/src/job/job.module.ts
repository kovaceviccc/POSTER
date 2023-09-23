import { Module } from '@nestjs/common';
import { JobController } from './controller/job.controller';
import { JobService } from './service/job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostEntity } from './models/job-post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { JobApplicationEntity } from './models/job-application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPostEntity, JobApplicationEntity]),
    AuthModule,
    UserModule
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService]
})
export class JobModule { }
