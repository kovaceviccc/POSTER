import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map } from 'rxjs';
import { JobTypeEnum } from 'src/app/models/job-type.enum';
import { JobService } from 'src/app/services/job-service/job.service';
import { JobCreatedDialogComponent } from '../../job-created-dialog/job-created-dialog.component';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent implements OnInit {

  createJobForm: FormGroup = null!;
  jobTypes = Object.values(JobTypeEnum);

  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private dialog: MatDialog)
  {}



  ngOnInit(): void {
    this.createJobForm = this.formBuilder.group({
      jobTitle: [null, [
        Validators.required,
        Validators.minLength(10)
      ]],
      jobDescription: [null, [
        Validators.required,
        Validators.minLength(15)
      ]],
      jobLocation: [null, [
        Validators.required
      ]],
      jobType: [null, [
        Validators.required
      ]]
    });
  }

  onSubmit() {
    if(!this.createJobForm.valid) return;

    this.jobService.postJob(this.createJobForm.value).pipe(
      map((success) => {
        if(success) {
          this.dialog.open(JobCreatedDialogComponent, {data: success, exitAnimationDuration: 400, enterAnimationDuration: 500, width: '50%', height: '40%' });
          this.createJobForm.reset();
        }
      })
    ).subscribe();
  }


  

}
