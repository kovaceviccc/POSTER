import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { JobDialogComponent } from '../components/job-dialog/job-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export const authGuard: CanActivateFn = () => isAuthenticated();
export const adminGuard: CanActivateFn = () => isAdmin();
export const userGuard: CanActivateFn = () => isUser();
export const creatorGuard: CanActivateFn = () => isCreator();


function isAuthenticated(): Observable<boolean> {

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if (authService === null) return of(false);

  return authService.isAuthenticated().pipe(
    map((result: boolean) => {
      if (!result) {
        router.navigate(['login']);
        return false;
      }
      return true;
    }),
    catchError((error: any) => {
      console.error('Error checking authentication:', error);
      return of(false);
    })
  );
}

function isAdmin(): Observable<boolean> {

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const dialog = inject(MatDialog);
  if (authService === null || router === null || dialog === null) return of(false);

  return from(authService.isAuthenticated()).pipe(
    switchMap((authenticated: boolean) => {

      if (!authenticated) router.navigate(['login']);
      return from(authService.isAdmin()).pipe(
        map((result: boolean) => {
          if (!result) {
            const dialogRef = dialog.open(JobDialogComponent, { width: '500px', height: '200px' });
            dialogRef.afterClosed().subscribe(
              (result: boolean) => {
                if (result) router.navigate(['login']);
              }
            );
          }
          return result;
        })
      );
    })
  );
}

function isUser(): boolean {

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const activatedRoute = inject(ActivatedRoute);

  console.log(activatedRoute);
  if (authService === null) return false;

  if (!authService.isAuthenticated()) {
    router.navigate(['login']);
    return false;
  }
  const userId = authService.getUserId()
  return true;
}

function isCreator(): Observable<boolean> {

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const dialog = inject(MatDialog);
  if (authService === null || router === null || dialog === null) return of(false);

  return from(authService.isAuthenticated()).pipe(
    switchMap((authenticated: boolean) => {

      if (!authenticated) router.navigate(['login']);
      return from(authService.isJobCreator()).pipe(
        map((result: boolean) => {
          if (!result) {
            const dialogRef = dialog.open(JobDialogComponent, { width: '500px', height: '200px' });
            dialogRef.afterClosed().subscribe(
              (result: boolean) => {
                if (result) router.navigate(['login']);
              }
            );
          }
          return result;
        })
      );
    })
  );

}


// export const adminGuard: CanActivateFn = () => {

//   const authService = inject(AuthenticationService);
//   const router = inject(Router);

//   if(authService === null || router === null) return false;

//   if(!authService.isAuthenticated()) {

//     router.navigate(['login']);
//     return false;
//   }

// };
