import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {UserInfoType} from "../../../types/user-info.type";
import {UserService} from "../../shared/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = !!localStorage.getItem(this.accessTokenKey);

  constructor(private http: HttpClient, private userService: UserService) {
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    } );
  }

  signup(name: string ,email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    this.userService.setUserName(name);
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name ,email, password
    } );
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      } );
    }
    this.userService.clearUserName()
    throw throwError(() => 'Can not find token');
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('userName');
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken:localStorage.getItem(this.accessTokenKey),
      refreshToken:localStorage.getItem(this.refreshTokenKey),
    };
  }


  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if(id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  getUserInfo() : Observable<UserInfoType | DefaultResponseType> {
     return  this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users');
  }
  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshTokens: tokens.refreshToken
      });
    }
    throw throwError(() => 'Can not use token');
  }



}
