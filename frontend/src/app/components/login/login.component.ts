import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = null!;
  public lastActivatedUrl?: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(6)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  onSubmit() {
    if (this.loginForm?.invalid) return;
    this.authService.login(this.loginForm?.value.email, this.loginForm?.value.password).pipe(
      map(token => {
        this.lastActivatedUrl ? this.router.navigate([this.lastActivatedUrl]) : this.router.navigate(['']);
      })
    ).subscribe();
  }
}
