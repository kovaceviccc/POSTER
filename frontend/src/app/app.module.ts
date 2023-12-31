import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UsersComponent } from './components/users/users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { MatCardModule } from '@angular/material/card';
import { UpdateUserProfileComponent } from './components/update-user-profile/update-user-profile.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { JobComponent } from './components/job/job.component';
import { JobDialogComponent } from './components/job-dialog/job-dialog.component';
import { JobDetailsComponent } from './components/job-details/job-details/job-details.component';
import { TimePipePipe } from './pipes/time-pipe.pipe';
import { CreateJobComponent } from './components/create-job/create-job/create-job.component';
import { Store, StoreModule } from '@ngrx/store';
import { jobReducer } from './../store/reducers/job.reducer';
import { EffectsModule } from '@ngrx/effects';
import { JobEffects } from 'src/store/effects/job.effects';
import { authReducer } from 'src/store/reducers/auth.reducer';
import { JobCreatedDialogComponent } from './components/job-created-dialog/job-created-dialog.component';
import { AuthEffects } from 'src/store/effects/auth.effects';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserProfileComponent,
    UpdateUserProfileComponent,
    JobComponent,
    JobDialogComponent,
    JobDetailsComponent,
    TimePipePipe,
    CreateJobComponent,
    JobCreatedDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    StoreModule.forFeature('job', jobReducer),
    StoreModule.forRoot({ 'job': jobReducer }),
    StoreModule.forFeature('auth', authReducer),
    StoreModule.forRoot({ 'auth': authReducer }),
    EffectsModule.forRoot([JobEffects, AuthEffects])
  ],
  providers: [
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
