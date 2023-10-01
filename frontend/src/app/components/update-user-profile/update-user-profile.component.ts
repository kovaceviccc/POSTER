import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, ObservableNotification, catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthenticationService, User } from 'src/app/services/authentication-service/authentication.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { AppState } from 'src/state/app.state';
import { selectUserProfile } from '../../../store/selectors/auth.selectors';
import * as AuthActions from '../../../store/actions/auth.action';


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

  form: FormGroup = null!;
  file: File = null!;
  userProfile$: Observable<User | null> = null!;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private readonly store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.store.dispatch(AuthActions.getUserProfile());
    this.userProfile$ = this.store.select(selectUserProfile);

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

    this.userProfile$.subscribe(
      result => {
        console.log(result);
        this.form.patchValue({
          id: result?.id,
          firstName: result?.firstName,
          lastName: result?.lastName,
          userName: result?.userName,
          profileImage: result?.profileImage
        });
      }
    );
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
