import { Body, Controller, Get, Param, Post, Delete, Put, UseGuards, Query, HttpStatus, UseInterceptors, UploadedFile, HttpException, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../models/user.interface';
import { Observable, catchError, from, map, of, tap } from 'rxjs';
import { LoginRequestDTO } from '../models/DTO/Request/LoginRequestDTO';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RegisterRequestDTO } from '../models/DTO/Request/RegisterRequestDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {multerOptionsImages} from 'src/const';


@Controller('users')
export class UserController {

    constructor(private userService: UserService,
        private config: ConfigService) { }

    @Post()
    create(@Res() res: Response, @Body() registrationRequest: RegisterRequestDTO): Observable<User> {

        return this.userService.create(registrationRequest).pipe(
            map((success: boolean) => {

                if (success) return res.status(HttpStatus.CREATED).send();

                return res.status(HttpStatus.EXPECTATION_FAILED).send();
            }),
            catchError((error) => error)
        );
    }

    @Post('login')
    login(@Body() loginRequest: LoginRequestDTO): Observable<any> {
        return this.userService.login(loginRequest.email, loginRequest.password).pipe(
            map((access_token: string) => {
                return { access_token: access_token };
            })
        )
    }

    @Get(':userId')
    //@hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    getById(@Param('userId') userId: string, @Res() res: Response) {

        if (userId === null) return of(res.status(HttpStatus.BAD_REQUEST).send());

        return this.userService.findOne(userId).pipe(
            map((user: User) => {
                if (user === null) return res.status(HttpStatus.NO_CONTENT).send();
                return res.status(HttpStatus.ACCEPTED).send(user);
            })
        );
    }

    @Get('get/profile')
    @UseGuards(JwtAuthGuard)
    getProfileData(@Request() req, @Res() res: Response) {

        const userId: string = req.user.id;
        if (userId === null) return of(res.status(HttpStatus.BAD_REQUEST).send());

        return this.userService.findOne(userId).pipe(
            map((user: User) => {
                if (user === null) return res.status(HttpStatus.NO_CONTENT).send();
                return res.status(HttpStatus.ACCEPTED).send(user);
            })
        )

    }


    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

        if (username === null || username === undefined) {
            return this.userService.paginate({ page, limit, route: 'http://localhost/3000/users' });
        }

        return this.userService.paginateFilterByUserName({ page, limit, route: 'http://localhost/3000/users' }, username)
    }

    @Delete(':id')
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteUser(@Param('id') id: string): Observable<any> {

        return this.userService.deleteOne(id);
    }

    @Put('/update')
    @UseGuards(JwtAuthGuard)
    updateUser(@Body() user: User, @Request() req, @Res() res: Response): Observable<any> {

        return this.userService.updateOne(req.user.id, user).pipe(
            catchError(error => {
                console.log(error);
                throw new HttpException(`Failed to update your data`, HttpStatus.BAD_REQUEST);
            }),
            map((updateResult: UpdateResult, index: number) => {

                if (updateResult.affected === 0) return res.status(HttpStatus.BAD_REQUEST).send('failed to update your data');

                return res.status(HttpStatus.ACCEPTED).send();
            })
        );
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param() id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(id, user);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', multerOptionsImages))
    upload(@UploadedFile() file: Express.Multer.File, @Request() req, @Res() res: Response): Observable<Object> {

        if (file === null || file === undefined) {
            return of(res.status(HttpStatus.BAD_REQUEST).send('File is missing'));
        }

        const user: User = req.user;

        if (user.profileImage) {
            this.userService.deleteProfileImage(user.profileImage).pipe(
                map((success: boolean) => {
                    if (!success) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to delete image');
                }),
                catchError((error) => {
                    return of(res.status(HttpStatus.INTERNAL_SERVER_ERROR).send());
                }
                )
            );
        }

        return this.userService.updateOne(user.id, { profileImage: file.filename }).pipe(

            map((user: User) => (res.status(HttpStatus.OK).send({ profileImage: user.profileImage }))),
            catchError((error) => {
                return of(res.status(HttpStatus.INTERNAL_SERVER_ERROR).send());
            })
        );
    }

    @Get('profileimage/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res: Response): Observable<Object> | Observable<any> {

        const filePath = this.config.get('PROFILE_IMAGES_UPLOAD_PATH');



        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename))).pipe(
            catchError((error) => of(res.status(HttpStatus.NOT_FOUND).send()))
        );
    }
}