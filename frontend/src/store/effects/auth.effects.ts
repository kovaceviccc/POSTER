import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthenticationService } from "src/app/services/authentication-service/authentication.service";
import * as AuthActions from './../actions/auth.action';
import { catchError, map, of, switchMap } from "rxjs";

@Injectable()
export class AuthEffects {

    constructor(
        private actions$: Actions,
        private authService: AuthenticationService
    ){}

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

    

}