import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { Store } from '@ngrx/store';
import {selectIsJobCreator, selectIsLoggedIn} from '../store/selectors/auth.selectors';
import { Observable, Subject, map } from 'rxjs';
import * as AuthActions from '../store/actions/auth.action';
import { AppState } from 'src/state/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'frontend';
  isLoggedIn$: Observable<boolean> = null!;
  isJobCreator$: Observable<boolean> = null!;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private store: Store<AppState>) {}
  
  ngOnInit(): void {

    this.authService.isAuthenticated().pipe(
      map((result) => {
        this.store.dispatch(AuthActions.setIsLoggedIn(result))
      })
    );
    this.store.dispatch(AuthActions.checkIsLoggedIn());
    this.store.dispatch(AuthActions.checkIsJobCreator());
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isJobCreator$ = this.store.select(selectIsJobCreator);

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
