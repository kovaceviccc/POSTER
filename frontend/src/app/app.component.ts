import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { Observable, from, map, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'frontend';
  isAuthenticated: boolean = false;
  entries = [
    {
      name: 'Login',
      link: 'login'
    },
    {
      name: 'Register',
      link: 'register'
    },
    {
      name: 'Update profile',
      link: 'update-profile'
    }
  ];

  constructor(private router: Router, private authService: AuthenticationService) {

  }
  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((result: boolean) => {
      this.isAuthenticated = result;
    });
  }


  navigateTo(value: string) {
    this.router.navigate(['../', value]);
  }

  logOut(): void {
    this.authService.logOut().subscribe((result: boolean) => {
      this.isAuthenticated = result;
      if (result) this.router.navigate(['']);
    });

  }
}
