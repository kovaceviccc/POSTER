import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Renderer2, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { map } from 'rxjs';
import { JobDetails } from 'src/app/models/job-details';
import { JobService } from 'src/app/services/job-service/job.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(100%)' })),
      state('*', style({ transform: 'translateX(0)' })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-in')),
    ]),
  ]
})
export class JobDetailsComponent implements OnInit, OnDestroy {

  public job: JobDetails = null!;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly jobId: string,
    private dialogRef: MatDialogRef<JobDetailsComponent>,
    private jobService: JobService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {

    if (this.jobId === null) this.router.navigate(['not-found']);

    this.jobService.findById(this.jobId).pipe(
      map((result) => {
        this.job = result
      })
    ).subscribe();



  }
  ngOnDestroy(): void {
    this.dialogRef.close(false);
  }
}
