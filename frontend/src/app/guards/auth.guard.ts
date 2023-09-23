import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = () => isAuthenticated();
export const adminGuard: CanActivateFn = () => isAdmin();
export const userGuard: CanActivateFn = () => isUser();


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
  if (authService === null || router === null) return of(false);

  return from(authService.isAuthenticated()).pipe(
    switchMap((authenticated: boolean) => {

      if(!authenticated) router.navigate(['login']);

      return from(authService.isAdmin()).pipe(
        map((result: boolean)=> {
          console.log(result);
          if(!result) {
            router.navigate(['login']);
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

  console.log(router)

  return true;
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
