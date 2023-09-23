import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { JobData } from 'src/app/models/job-data';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private httpClient: HttpClient) { }



  findAll(page: number, size: number): Observable<JobData> {

    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.httpClient.get('/api/job/', { params }).pipe(
      map((jobData: JobData | any) => {
        console.log(jobData)
        return jobData;
      }),
      catchError(err => throwError(() => new Error(err)))
    );

  }
}
