import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthenticationService, User } from 'src/app/services/authentication-service/authentication.service';
import { UserService } from 'src/app/services/user-service/user.service';


export interface File {
  data: any,
  progress: number,
  inProgress: boolean
}

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss']
})
export class UpdateUserProfileComponent implements OnInit {

  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef = null!;

  user: User = null!;
  form: FormGroup = null!;
  file: File = null!;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {

    this.file = {
      data: null,
      inProgress: false,
      progress: 0
    };

    this.form = this.formBuilder.group(
      {
        id: [{ value: null, disabled: true }, [Validators.required]],
        firstName: [{ value: null }, [Validators.required]],
        lastName: [{ value: null }, Validators.required],
        userName: [null, [Validators.required]],
        profileImage: [null]
      }
    );

    this.authService.getUserId().pipe(
      switchMap((id: number) => {
        return this.userService.getProfileData().pipe(
          tap((user: User) => {
            this.user = user;
            this.form.patchValue({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              userName: user.userName,
              profileImage: user.profileImage
            });
          })
        );
      })
    ).subscribe();
  }

  onClick() {

    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();

    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      };
      this.fileUpload.nativeElement.value = '',
        this.uploadFile();
    }
  }

  uploadFile() {

    if (this.file === null) return;

    const formData = new FormData()
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.userService.uploadProfileImage(formData).pipe(
      tap((e) => console.log(e)),
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            console.log(this.file.progress);
            break;

          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false;
        return of('Upload failed!');
      })
    ).subscribe((event) => {
      if (typeof (event) === 'object') {
        this.form.patchValue({
          profileImage: event.body.profileImage
        });
      }
    })
  }

  update() {
    this.userService.updateUser(this.form.getRawValue()).subscribe();
  }
}
