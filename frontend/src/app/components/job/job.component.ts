import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs';
import { authGuard } from 'src/app/guards/auth.guard';
import { JobData } from 'src/app/models/job-data';
import { JobService } from 'src/app/services/job-service/job.service';
import { JobDialogComponent } from '../job-dialog/job-dialog.component';
import { Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})

export class JobComponent implements OnInit {


  dataSource: JobData = null!;
  pageEvent: PageEvent = null!;


  constructor(
    private jobService: JobService,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthenticationService
  ) {}


  ngOnInit(): void {
    this.jobService.findAll(1, 5).pipe(
      map((jobData: JobData) => {
        this.dataSource = jobData
      })
    )
    .subscribe();
  }

  onPaginateChange(event: PageEvent) {

    let page = event.pageIndex;
    let size = event.pageSize;
    //TODO: add filtering by job title
    page++;
    this.jobService.findAll(page, size).pipe(
      map((jobData: JobData) => {
        this.dataSource = jobData;
      })
    )
    .subscribe();
  }

  
  bookmark(jobId: string) {
    this.authService.isAuthenticated().pipe(
      map((authenticated: boolean) => {
        if(!authenticated) {

          const dialogRef = this.dialog.open(JobDialogComponent, {width: '500px', height: '200px'});
          dialogRef.afterClosed().subscribe(
            (result: boolean) => {
              if(result) this.router.navigate(['login']);
            }
          );
        }
      })
    ).subscribe();
  }

}
