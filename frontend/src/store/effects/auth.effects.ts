import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthenticationService, User } from "src/app/services/authentication-service/authentication.service";
import * as AuthActions from './../actions/auth.action';
import { catchError, map, of, switchMap, tap } from "rxjs";
import { UserService } from "src/app/services/user-service/user.service";

@Injectable()
export class AuthEffects {

    constructor(
        private actions$: Actions,
        private authService: AuthenticationService,
        private userService: UserService
    ) { }

    checkIsLoggedIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.checkIsLoggedIn),
            switchMap(() =>
                this.authService.isAuthenticated().pipe(
                    map((isLoggedIn: boolean) => AuthActions.setIsLoggedIn(isLoggedIn)),
                    catchError(() => of(AuthActions.setIsLoggedIn(false)))
                )
            )
        )
    );

    checkIsJobCreator$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.checkIsJobCreator),
            switchMap(() =>
                this.authService.isJobCreator().pipe(
                    map((isJobCreator: boolean) => AuthActions.setIsJobCreator(isJobCreator)),
                    catchError(() => of(AuthActions.setIsLoggedIn(false)))
                )
            )
        )
    );

    checkIsAdmin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.checkIsAdmin),
            switchMap(() =>
                this.authService.isAdmin().pipe(
                    map((isAdmin: boolean) => AuthActions.setIsAdmin(isAdmin)),
                    catchError(() => of(AuthActions.setIsAdmin(false)))
                )
            )
        )
    );

    loadJobData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loadUserData),
            switchMap(() =>
                this.userService.getProfileData().pipe(
                    map((user: User) => AuthActions.loadUserDataSuccess(user)),
                    catchError(() => of(AuthActions.loadUserDataSuccess(null)))
                )
            )
        )
    );


}