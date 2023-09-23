import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { User } from "src/user/user/models/user.interface";
import { UserService } from "src/user/user/service/user.service";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService) {

    }


    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler()); //this checks if a 'roles' decorator is required for the specific endpoint,
        //if there are no roles required just return true

        if (!roles) return true;

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        
        return this.userService.findOne(user.id).pipe(
            map((user: User) => {
                const hasRole = () => roles.indexOf(user.role) > -1;
                let hasPermission: boolean = false;

                if (hasRole()) hasPermission = true;

                const result = user && hasPermission;

                return result;
            })
        )
    }

}