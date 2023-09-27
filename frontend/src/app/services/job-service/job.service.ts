import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, catchError, from, map, of, throwError } from 'rxjs';
import { CreateJobRequest } from 'src/app/models/create-job.request';
import { JobData } from 'src/app/models/job-data';
import { JobDetails } from 'src/app/models/job-details';
import { AppState } from 'src/state/app.state';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(
    private httpClient: HttpClient,
    private store: Store<AppState>) { }

  findAll(page: number, size: number): Observable<JobData> {

    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.httpClient.get('/api/job/', { params }).pipe(
      map((jobData: JobData | any) => {
        return jobData;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  findById(jobId: string): Observable<JobDetails> {
    return this.httpClient.get(`/api/job/${jobId}`).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  applyForJob(jobId: string, cvFile: File, coverLetter: string): Observable<boolean> {

    if(jobId === null || cvFile === null) return of(false) ;

    const formData = new FormData();
    formData.append('file', cvFile);
    formData.append('coverLetter', coverLetter);

    return this.httpClient.post(`/api/job/apply/${jobId}`, formData, {responseType: 'json', observe: 'events'}).pipe(
      map((response) => {
        console.log("Response: ", response);
        return true;
      }),
      catchError(err => {
        console.log("Error in job apply: ", err);
        return of(false);
      })
    );
  }

  postJob(jobPostRequrest: CreateJobRequest) : Observable<boolean> {
    return this.httpClient.post<HttpResponse<boolean>>('/api/job/create', jobPostRequrest).pipe(
      map((response) => {
        console.log(response);
        return true;
      }),
      catchError(err => {
        console.log("error in job Posting: ", err);
        return of(false);
      })
    );
  }
}
