import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as JobActions from '../actions/job.actions';
import { JobService } from 'src/app/services/job-service/job.service';
import { JobData } from 'src/app/models/job-data';

@Injectable()
export class JobEffects {
  constructor(
    private actions$: Actions, 
    private jobService: JobService) {}

  loadJobData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.loadJobData),
      switchMap((action) =>
        this.jobService.findAll(action.page, action.size).pipe(
          tap((result) => result),
          map((jobData: JobData) => JobActions.loadJobDataSuccess({ jobData })),
          catchError((error) => of(JobActions.loadJobDataFailure({ error })))
        )
      )
    )
  );
}