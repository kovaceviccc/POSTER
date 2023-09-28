import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject, filter, map } from 'rxjs';
import { authGuard } from 'src/app/guards/auth.guard';
import { JobData } from 'src/app/models/job-data';
import { JobService } from 'src/app/services/job-service/job.service';
import { JobDialogComponent } from '../job-dialog/job-dialog.component';
import { Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { JobDetailsComponent } from '../job-details/job-details/job-details.component';
import { Job } from 'src/app/models/job';
import { AppState } from 'src/state/app.state';
import { Store } from '@ngrx/store';
import { selectJobData, selectJobError, selectJobLoading } from 'src/store/selectors/job.selectors';
import * as JobActions from '../../../store/actions/job.actions';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})

export class JobComponent implements OnInit, OnDestroy {

  loading$: Observable<boolean> = null!;
  dataSource$: Observable<JobData | null> = null!;
  data: JobData | null = null!;
  errors$ : Observable<string> | any;
  pageEvent: PageEvent = null!;
  showJobDetails: boolean = false;
  filteredJobs: Job[]= null!;
  isJobPoster: boolean = false;
  private unsubscribe$ = new Subject<void>();


  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthenticationService,
    private store: Store<AppState>
  ) {

   }

  ngOnInit(): void {

    this.dataSource$ = this.store.select(selectJobData);
    this.loading$ = this.store.select(selectJobLoading);
    this.errors$ = this.store.select(selectJobError)
    this.store.dispatch(JobActions.loadJobData({page: 1, size: 5}));

    this.authService.isJobCreator().subscribe(
      (result) => this.isJobPoster = result
    );    
  }

  onPaginateChange(event: PageEvent) {

    let page = event.pageIndex;
    let size = event.pageSize;
    //TODO: add filtering by job title
    page++;
    this.store.dispatch(JobActions.loadJobData({page, size}));
  }

  bookmark(jobId: string) {
    this.authService.isAuthenticated().pipe(
      map((authenticated: boolean) => {
        if (!authenticated) {
          const dialogRef = this.dialog.open(JobDialogComponent, { width: '500px', height: '200px' });
          dialogRef.afterClosed().subscribe(
            (result: boolean) => {
              if (result) this.router.navigate(['login']);
            }
          );
        }
      })
    ).subscribe();
  }

  filterJobs(filterOption: string) {

    console.log(filterOption);
    // switch(filterOption) 
    // {
    //   case "recent": {
    //     this.filteredJobs = this.dataSource$.items.sort((jobA: Job, jobB: Job) => {
    //       const timeStampA = new Date(jobA.postedAtUTC).getTime();
    //       const timeStampB = new Date(jobB.postedAtUTC).getTime();
    //       return timeStampB - timeStampA;
    //     });
    //     break;
    //   }

    //   case "all": {
    //     this.filteredJobs = this.dataSource$.items;
    //     break;
    //   }

    //   case "saved": {
    //     this.filteredJobs = [];
    //   }
    // }
  }

  goToDetails(jobId: string) {
    // this.router.navigate(['job-details', jobId]);
    const dialogRef = this.dialog.open(JobDetailsComponent, { data: jobId, exitAnimationDuration: 400, enterAnimationDuration: 500, width: '80%', height: '80%' },);
    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        console.log(result);
      }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
