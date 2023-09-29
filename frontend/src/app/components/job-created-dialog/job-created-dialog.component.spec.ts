import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCreatedDialogComponent } from './job-created-dialog.component';

describe('JobCreatedDialogComponent', () => {
  let component: JobCreatedDialogComponent;
  let fixture: ComponentFixture<JobCreatedDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobCreatedDialogComponent]
    });
    fixture = TestBed.createComponent(JobCreatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
