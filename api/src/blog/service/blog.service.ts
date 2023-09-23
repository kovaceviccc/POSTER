import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntryEntity } from '../model/blog-entry.entity';
import { Repository, UpdateResult } from 'typeorm';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { UserService } from 'src/user/user/service/user.service';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { CreateBlogDto } from '../model/create-blog.dto';
import { User } from 'src/user/user/models/user.interface';
import slugify from 'slugify';
import { time } from 'console';
import { BlogEntry } from '../model/blog-entry.interface';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(BlogEntryEntity) private readonly blogRepository: Repository<BlogEntryEntity>,
        private authService: AuthService,
        private readonly userService: UserService
    ) { }


    create(createBlogDto: CreateBlogDto, user: User): Observable<boolean> {

        if (createBlogDto === null || user === null) return of(null);

        return this.mapDTO(createBlogDto, user).pipe(
            switchMap((blog: BlogEntryEntity) => {
                return from(this.blogRepository.save(blog)).pipe(
                    map((result: BlogEntryEntity) => {

                        if (result === null) return false;
                        return true;
                    })
                )
            })
        );
    }

    // getBlogEntriesByUserId(userId: string): Observable<BlogEntry[]> {

    //     if (userId === null) return from([]);

    //     return from(this.blogRepository.find({
    //         where: { author: { id: userId } }
    //     }));
    // }

    getById(blogId: number): Observable<BlogEntry> {

        if (blogId === null) return null;

        return from(this.blogRepository.findOne({
            where: { id: blogId },
            relations: ['author']
        }));
    }

    updateBlog(id: number, blogEntry: BlogEntry): Observable<boolean> {

        return from(this.blogRepository.update(id, blogEntry)).pipe(
            map((result) => {

                if (result.affected === 0) return false;
                return true;
            })
        )
    }

    // paginateBlogs(options: IPaginationOptions): Observable<Pagination<BlogEntry>> {
    //     return from(paginate<BlogEntry>(this.blogRepository, options, {
    //         relations: ['author']
    //     })).pipe(
    //         map((blogs: Pagination<BlogEntry>) => {
    //             blogs.items.forEach(element => {
    //                 delete element.author.passwordHash;
    //             });

    //             return blogs;
    //         })
    //     );
    // }





    private mapDTO(createBlogDto: CreateBlogDto, user: User): Observable<BlogEntry> {

        const result: BlogEntry = {

            title: createBlogDto.title,
            description: createBlogDto.description,
            body: createBlogDto.body,
            headerImage: createBlogDto.headerImage,
            author: user,
            slug: this.generateSlug(createBlogDto.title)
        }
        return of(result);
    }

    private generateSlug(title: string): string {
        return slugify(title);
    }

}
