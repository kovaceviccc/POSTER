import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, map, of, switchMap } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";


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

  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService) { }

  login(email: string, password: string) {
    return this.httpClient.post<any>('/api/users/login', { email, password }).pipe(
      map((token) => {
        localStorage.setItem(JWT_TOKEN, token.access_token);
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
    return of(!this.jwtHelper.isTokenExpired(token));
  }

  isAdmin(): Observable<boolean> {
    const token: string | null = localStorage.getItem(JWT_TOKEN);
    if(token === null) return of(false);
    const decodedToken = this.jwtHelper.decodeToken(token);
    const result = decodedToken.user.role === 'admin'
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
    console.log(jwt);
    if (jwt === null) return of(true);
    localStorage.removeItem(JWT_TOKEN);
    return of(true);
  }

}
