import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^(?:[А-ЯЁ][а-яё]*)(?:\s[А-ЯЁ][а-яё]*)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    agree: ['', Validators.required]
  })
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
  }
  getInputStyle(input: string) {
    return {
      'border-color': this.signupForm.get(input)?.invalid &&
      (this.signupForm.get(input)?.dirty || this.signupForm.get(input)?.touched) ? 'red' : ''
    };
  }

  isInputInvalid(input: string): boolean | undefined {
    return this.signupForm.get(input)?.invalid &&
      (this.signupForm.get(input)?.dirty || this.signupForm.get(input)?.touched);
  }

  signup() {
    if(this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password)
    {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data ) => {
            let error = null;
            if((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if(!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Error during authorization';
            }

            if(error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            localStorage.setItem('userName', this.signupForm.value.name as string);
            this._snackBar.open('You have successfully logged in');
            this.router.navigate(['/']);
          },
          error: (error: HttpErrorResponse) => {
            if(error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Error during the registration');
            }
          }
        })
    }
  }
}
