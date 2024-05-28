import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  isLogged: boolean = false;
  userName!: string;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router, private userService: UserService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }



  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.userService.userName$.subscribe((userName: string | null) => {
      this.userName = userName as string;
    })

  }


  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('You have successfully logged out');
    this.router.navigate(['/']);
  }

}
