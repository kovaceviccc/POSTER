import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;


  constructor(private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router) {

    this.registerForm = this.formBuilder.group({
      firstName: [null, [
        Validators.required,
        Validators.minLength(2)
      ]],
      lastName: [null, [
        Validators.required,
        Validators.minLength(2)
      ]],
      userName: [null, [
        Validators.required,
        Validators.minLength(4)
      ]],
      email: [null, [
        Validators.required,
        Validators.email,
        Validators.minLength(3)
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(6),
        CustomValidators.passwordContainsNumber

      ]],
      passwordConfirm: [null, [Validators.required]]
    },
      { validators: CustomValidators.passwordsMatch })
  }

  onSubmit() {

    console.log(this.registerForm);
    if (!this.registerForm.valid) return;

    this.authService.register(this.registerForm.value).pipe(
      map(user => this.router.navigate(['login']))
    ).subscribe();

  }
}

class CustomValidators {

  static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {

    const regex = /\d/;

    if (control.value != null && regex.test(control.value)) return null;

    return { passwordInvalid: true };
  }

  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if ((password === passwordConfirm) && (password !== null) && passwordConfirm !== null) {
      return null;
    } else {
      return { passwordsNotMatching: true };
    }

  };
}

