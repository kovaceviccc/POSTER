import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, User } from './services/authentication-service/authentication.service';
import { Store } from '@ngrx/store';
import { selectIsJobCreator, selectIsLoggedIn, selectIsAdmin, selectUserProfile } from '../store/selectors/auth.selectors';
import { Observable, Subject, map } from 'rxjs';
import * as AuthActions from '../store/actions/auth.action';
import { AppState } from 'src/state/app.state';
import { UserService } from './services/user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'frontend';
  isLoggedIn$: Observable<boolean> = null!;
  isJobCreator$: Observable<boolean> = null!;
  isAdmin$: Observable<boolean> = null!;
  userData$: Observable<User | null> = null!;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private readonly userService: UserService,
    private store: Store<AppState>) { }

  ngOnInit(): void {

    this.authService.isAuthenticated().pipe(
      map((result) => {
        this.store.dispatch(AuthActions.setIsLoggedIn(result))
      })
    );
    this.authService.isAdmin().pipe(
      map((result) => {
        this.store.dispatch(AuthActions.setIsAdmin(result));
      })
    );

    this.authService.isJobCreator().pipe(
      map((result) => {
        this.store.dispatch(AuthActions.setIsJobCreator(result));
      })
    );



    this.store.dispatch(AuthActions.checkIsLoggedIn());
    this.store.dispatch(AuthActions.checkIsJobCreator());
    this.store.dispatch(AuthActions.checkIsAdmin());
    this.store.dispatch(AuthActions.loadUserData());
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isJobCreator$ = this.store.select(selectIsJobCreator);
    this.isAdmin$ = this.store.select(selectIsAdmin);

    this.userData$ = this.store.select(selectUserProfile);

    this.userData$.subscribe(
      result => console.log(result)
    );
  }

  navigateTo(value: string) {
    this.router.navigate(['../', value]);
  }

  logOut(): void {
    this.authService.logOut().subscribe((result: boolean) => {
      if (result) this.router.navigate(['']);
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
