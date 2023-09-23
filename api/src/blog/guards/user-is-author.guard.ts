import { CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { Observable, map, switchMap } from "rxjs";
import { UserService } from "src/user/user/service/user.service";
import { BlogService } from "../service/blog.service";
import { User } from "src/user/user/models/user.interface";
import { BlogEntry } from "../model/blog-entry.interface";


export class UserIsAuthorGuard implements CanActivate {

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @Inject(forwardRef(() => BlogService))
        private blogService: BlogService
    ) { }

    canActivate(context: ExecutionContext): Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const blogEntryId: number = Number(params.blogId);
        const user: User = request.user;

        return this.userService.findOne(user.id).pipe(
            switchMap((user: User) => this.blogService.getById(blogEntryId).pipe(
                map((blogEntry: BlogEntry) => {
                    if (user === null || blogEntry === null) return false;

                    console.log(user, blogEntry);

                    return user.id === blogEntry.author.id;
                })
            ))
        )


    }

}