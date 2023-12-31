import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UpdateUserProfileComponent } from './components/update-user-profile/update-user-profile.component';
import { adminGuard, authGuard, creatorGuard, userDataNotNullGuard } from './guards/auth.guard';
import { JobComponent } from './components/job/job.component';
import { JobDetailsComponent } from './components/job-details/job-details/job-details.component';
import { CreateJobComponent } from './components/create-job/create-job/create-job.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: UsersComponent
      },
      {
        path: ':id',
        component: UserProfileComponent
      }
    ]
  },
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [authGuard, userDataNotNullGuard]
  },
  {
    path: '',
    component: JobComponent
  },
  {
    path: 'job-details/:id',
    component: JobDetailsComponent,

  },
  {
    path: 'create-job',
    component: CreateJobComponent,
    canActivate: [creatorGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
