import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
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

  cvFile: File = null!;
  coverLetter:string = null!;
  job: JobDetails = null!;
  form: FormGroup = null!;
  file: File = null!;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly jobId: string,
    private dialogRef: MatDialogRef<JobDetailsComponent>,
    private jobService: JobService,
    private readonly router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    if (this.jobId === null) this.router.navigate(['not-found']);

    this.jobService.findById(this.jobId).pipe(
      map((result) => {
        console.log(result);
        this.job = result
      })
    ).subscribe();

    this.form = this.formBuilder.group(
      {
        coverLetter: [{value: null}, [Validators.minLength(50)]],
        cvFile: [null]
      }
    );
  }

  onTextChange(text: string) {
    this.coverLetter = text;
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      this.cvFile = fileList[0];
    }

  }

  onSubmit() {
    
    if(!this.cvFile) return;
    this.jobService.applyForJob(this.jobId, this.cvFile, this.coverLetter).pipe(
      map((result) => {
        //console.log(result)
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.dialogRef.close(false);
  }
}
