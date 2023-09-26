import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { filter, map } from 'rxjs';
import { authGuard } from 'src/app/guards/auth.guard';
import { JobData } from 'src/app/models/job-data';
import { JobService } from 'src/app/services/job-service/job.service';
import { JobDialogComponent } from '../job-dialog/job-dialog.component';
import { Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { JobDetailsComponent } from '../job-details/job-details/job-details.component';
import { Job } from 'src/app/models/job';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})

export class JobComponent implements OnInit {


  dataSource: JobData = null!;
  pageEvent: PageEvent = null!;
  showJobDetails: boolean = false;
  filteredJobs: Job[]= null!;
  isJobPoster: boolean = false;


  constructor(
    private jobService: JobService,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.jobService.findAll(1, 5).pipe(
      map((jobData: JobData) => {
        this.dataSource = jobData;
        this.filteredJobs = this.dataSource.items;
      })
    ).subscribe()

    this.authService.isJobCreator().subscribe(
      (result) => this.isJobPoster =result
    );
  }

  onPaginateChange(event: PageEvent) {

    let page = event.pageIndex;
    let size = event.pageSize;
    //TODO: add filtering by job title
    page++;
    this.jobService.findAll(page, size).pipe(
      map((jobData: JobData) => {
        console.log(jobData);
        this.dataSource = jobData;
        this.filteredJobs = this.dataSource.items;
      })
    )
      .subscribe();
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
    switch(filterOption) 
    {
      case "recent": {
        this.filteredJobs = this.dataSource.items.sort((jobA, jobB) => {
          const timeStampA = new Date(jobA.postedAtUTC).getTime();
          const timeStampB = new Date(jobB.postedAtUTC).getTime();
          return timeStampB - timeStampA;
        });
        break;
      }

      case "all": {
        this.filteredJobs = this.dataSource.items;
        break;
      }

      case "saved": {
        this.filteredJobs = [];
      }
    }
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

}
