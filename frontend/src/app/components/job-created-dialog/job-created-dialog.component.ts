import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-job-created-dialog',
  templateUrl: './job-created-dialog.component.html',
  styleUrls: ['./job-created-dialog.component.scss']
})
export class JobCreatedDialogComponent {

  createdJobSucceess: string = 'Successfully created job';
  createdJobFailed: string = 'Failed to create job';

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly success: boolean,
    private dialogRef: MatDialogRef<JobCreatedDialogComponent>,
  ){}


  onActionClick() {
    this.dialogRef.close();
  }
}
