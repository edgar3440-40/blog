import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userNameSubject = new BehaviorSubject<string | null>(null);
  userName$ = this.userNameSubject.asObservable();

  setUserName(userName: string) {
    localStorage.setItem('userName', userName);
    this.userNameSubject.next(userName);
  }

  clearUserName() {
    localStorage.removeItem('userName');
    this.userNameSubject.next(null);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }
}
