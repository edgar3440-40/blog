import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {UserInfoType} from "../../../../types/user-info.type";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
              private _snackBar: MatSnackBar, private userService: UserService) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    rememberMe: [false],
  })

  password: string = 'password';

  userInfo!: UserInfoType;

  showPassword: boolean = false;

  ngOnInit(): void {


  }

  getInputStyle(input: string) {
    return {
      'border-color': this.loginForm.get(input)?.invalid &&
      (this.loginForm.get(input)?.dirty || this.loginForm.get(input)?.touched) ? 'red' : ''
    };
  }

  isInputInvalid(input: string): boolean | undefined {
    return this.loginForm.get(input)?.invalid &&
      (this.loginForm.get(input)?.dirty || this.loginForm.get(input)?.touched);
  }

  login() {
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password ) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error ;
            if((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if(!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Error during authorization';
            }


            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this.authService.getUserInfo()
              .subscribe({
                next: (data: UserInfoType | DefaultResponseType) => {
                  if((data as DefaultResponseType).error) {
                    this._snackBar.open('There is an Error during getting the name')
                  }

                  this.userInfo = data as UserInfoType;
                  this.userService.setUserName(this.userInfo.name);


                }
              })

            this.router.navigate(['/']);
          },
          error: (error: HttpErrorResponse) => {
            if(error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Error during the authorization');
            }
          }
        })

    }

  }

  togglePassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }
  }

}
