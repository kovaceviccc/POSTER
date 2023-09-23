import { Body, Controller, Post, UseGuards, Request, Res, HttpStatus, Get, Query, Param, Delete, NotImplementedException, Req, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { CreateBlogDto } from '../model/create-blog.dto';
import { BlogService } from '../service/blog.service';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { BlogEntry } from '../model/blog-entry.interface';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { UserRole } from 'src/user/user/models/user.interface';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';

@Controller('blogs')
export class BlogController {

    constructor(private readonly blogService: BlogService) {

    }

    @Post()
    @UseGuards(JwtAuthGuard)
    createBlog(@Body() blog: CreateBlogDto, @Request() req, @Res() res: Response) {

        const user = req.user;
        if (user === null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        return this.blogService.create(blog, user).pipe(
            map((result: boolean) => {

                if (result) return res.status(HttpStatus.CREATED).send();

                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            })
        );
    }

    // @Get('user')
    // @UseGuards(JwtAuthGuard)
    // findAllPostedByUser(@Request() req, @Res() res: Response) {

    //     const user = req.user;

    //     if (user === null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();

    //     return this.blogService.getBlogEntriesByUserId(user.id).pipe(
    //         map((result: BlogEntry[]) => {
    //             if (result.length === 0) return res.status(HttpStatus.NO_CONTENT).send();
    //             return res.status(HttpStatus.ACCEPTED).send(result);
    //         })
    //     );
    // }

    // @Get('')
    // index(
    //     @Query('page') page: number = 1,
    //     @Query('limit') limit: number = 10,
    // ) {

    //     limit = limit > 100 ? 100 : limit;

    //     return this.blogService.paginateBlogs(
    //         {
    //             limit: Number(limit),
    //             page: Number(page),
    //             route: 'http://localhost:3000/api/blogs'
    //         }
    //     );
    // }

    // @Get('user/:userId')
    // @hasRoles(UserRole.ADMIN)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // findAllPostsByUser(@Param('userId') userId: string, @Res() res: Response) {

    //     if (userId === null) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();

    //     return this.blogService.getBlogEntriesByUserId(userId).pipe(
    //         map((result: BlogEntry[]) => {
    //             if (result.length === 0) return res.status(HttpStatus.NO_CONTENT).send();
    //             return res.status(HttpStatus.ACCEPTED).send(result);
    //         })
    //     );


    // }

    @Delete('user/:blogId')
    @hasRoles(UserRole.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteBlog(@Param('blogId') blogId: number, @Request() req, @Res() res: Response) {

        throw new NotImplementedException("method not implemented");
    }

    @Get(':blogId')
    @hasRoles(UserRole.USER)
    @UseGuards(JwtAuthGuard)
    getById(@Param('blogId') blogId: string, @Request() req, @Res() res: Response) {
        throw new NotImplementedException("method not implemented");
    }

    @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
    @Put('update/:blogId')
    updateBlog(@Param('blogId') blogId: number, @Body() blogEntry: BlogEntry, @Request() req, @Res() res: Response) {

        if (blogId === null || blogEntry === null) return res.status(HttpStatus.BAD_REQUEST).send();

        return this.blogService.updateBlog(blogId, blogEntry).pipe(
            map((result: boolean) => {

                if (result) return res.status(HttpStatus.OK).send();

                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            })
        )

    }

}
