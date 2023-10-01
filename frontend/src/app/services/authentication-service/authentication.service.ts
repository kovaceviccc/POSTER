import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, map, of, switchMap } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import * as AuthActions from '../../../store/actions/auth.action';
import { Store } from '@ngrx/store';
import { AppState } from 'src/state/app.state';
import { UserService } from '../user-service/user.service';

export interface User {
  id?: number;
  firstName?: string,
  lastName?: string,
  userName?: string,
  email?: string,
  password?: string;
  passwordConfirm?: string;
  profileImage?: string;
  role?: string;
}

export const JWT_TOKEN = 'jwt_token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly jwtHelper: JwtHelperService,
    private readonly store: Store<AppState>,
    private readonly userService: UserService) { }

  login(email: string, password: string) {
    return this.httpClient.post<any>('/api/users/login', { email, password }).pipe(
      map((token) => {
        localStorage.setItem(JWT_TOKEN, token.access_token);
        this.store.dispatch(AuthActions.setIsLoggedIn(true));
        this.store.dispatch(AuthActions.getUserProfile());
        return token;
      })
    )
  }

  register(user: User) {
    delete user.passwordConfirm;
    return this.httpClient.post<any>('api/users/', user).pipe(
      map(result => {
        console.log(result)
      })
    )
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem(JWT_TOKEN);
    const isTokenValid = !this.jwtHelper.isTokenExpired(token)
    this.store.dispatch(AuthActions.setIsLoggedIn(isTokenValid));
    this.store.dispatch(AuthActions.getUserProfile());
    return of(isTokenValid);
  }

  isAdmin(): Observable<boolean> {
    const token: string | null = localStorage.getItem(JWT_TOKEN);
    if (token === null) {
      this.store.dispatch(AuthActions.setIsAdmin(false));
      return of(false);
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    const result = decodedToken.user.role === 'admin'
    this.store.dispatch(AuthActions.setIsAdmin(result));
    return of(result);
  }

  isJobCreator(): Observable<boolean> {
    const token: string | null = localStorage.getItem(JWT_TOKEN);
    if (token === null) {
      this.store.dispatch(AuthActions.setIsJobCreator(false));
      return of(false);
    }
    const decodedToken = this.jwtHelper.decodeToken(token);
    const result = decodedToken.user.role === 'jobcreator'
    this.store.dispatch(AuthActions.setIsJobCreator(result));
    return of(result);
  }
  getUserId(): Observable<number> {
    const jwt = localStorage.getItem(JWT_TOKEN);
    if (jwt === null) return of(-1);
    const token = this.jwtHelper.decodeToken(jwt);
    return of(token.user.id);
  }

  logOut(): Observable<boolean> {
    const jwt = localStorage.getItem(JWT_TOKEN);

    if (jwt !== null) {
      localStorage.removeItem(JWT_TOKEN);
    }

    this.store.dispatch(AuthActions.setIsLoggedIn(false));
    this.store.dispatch(AuthActions.setIsJobCreator(false));
    this.store.dispatch(AuthActions.setIsAdmin(false));
    this.store.dispatch(AuthActions.setUserProfile(null));
    return of(true);
  }

}
