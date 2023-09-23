import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.scss']
})
export class JobDialogComponent {

  @Output() loginConfirmed = new EventEmitter<boolean>();

  constructor(private dialogRef: MatDialogRef<JobDialogComponent>) {}

  onActionClick(value: boolean) {
    this.dialogRef.close(value);
  }
}
