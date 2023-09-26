import { HttpClient, HttpParams } from '@angular/common/http';
import { CSP_NONCE, Injectable } from '@angular/core';
import { Observable, catchError, from, map, of, throwError } from 'rxjs';
import { JobData } from 'src/app/models/job-data';
import { JobDetails } from 'src/app/models/job-details';

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
}
