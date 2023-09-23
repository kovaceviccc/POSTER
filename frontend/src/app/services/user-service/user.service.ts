import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../authentication-service/authentication.service';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

export interface UserData {
  items: User[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  },
  links: {
    first: string,
    previous: string,
    next: string,
    last: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  findById(id: number): Observable<User> {
    return this.httpClient.get('/api/users/' + id).pipe(
      map((user: User) => user)
    );
  }

  getProfileData(): Observable<User> {
    return this.httpClient.get('/api/users/get/profile').pipe(
      map((user: User) => user)
    );
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put('/api/users/update', user)
  }

  findAll(page: number, size: number): Observable<UserData> {

    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.httpClient.get('/api/users', { params }).pipe(
      map((userData: UserData | any) => userData),
      catchError(err => throwError(() => new Error(err)))
    )
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.httpClient.post<FormData>('/api/users/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


  paginateByUserName(page: number, size: number, username: string): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));
    params = params.append('username', username);

    return this.httpClient.get('/api/users', { params }).pipe(
      map((userData: UserData | any) => userData),
      catchError(err => throwError(() => new Error(err)))
    )
  }
}
