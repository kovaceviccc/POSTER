import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { JobModule } from './job/job.module';
import { UserEntity } from './user/user/models/user.entity';
import { JobPostEntity } from './job/models/job-post.entity';
import { JobApplicationEntity } from './job/models/job-application.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [UserEntity, JobPostEntity, JobApplicationEntity],
      subscribers: ['entity']
    }),
    UserModule,
    AuthModule,
    BlogModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
