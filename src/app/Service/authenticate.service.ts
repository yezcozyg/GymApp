import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../Model/user';
import { Token } from '../Model/token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

   storageKey = 'authenticate-jwt';
   loginUrl = '/api/login';
   users: User[];

  constructor(private router: Router,
              private http: HttpClient) { }

  getAuthorizationOptions() {

    return {
     // headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.getToken()
   //   })
    };
  }

  post(user: User):any {
    console.log('posting');
    console.log(user);
    return this.http.post(this.loginUrl, user);

  }

  setToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken() {
    //console.log('getting token');
    return localStorage.getItem(this.storageKey);
  }

  isLoggedIn() {
    return this.getToken() != null;
  }

  isLoggedOut() {
    return this.getToken() == null;
  }

  logOut() {
    localStorage.removeItem(this.storageKey);
    console.log(this.storageKey);
    this.router.navigate(['/login']);
  }
}
