import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertifyService } from './alertify.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  get username() {
    return this.decodedToken.unique_name;
  }

  constructor(
    private http: HttpClient,
    private alertifyService: AlertifyService,
    private router: Router
  ) {}

  login(model: any) {
    console.log(model);
    return this.http.post(`${this.baseUrl}login`, model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
        }
      })
    );
  }

  decodeToken(token: string) {
    this.decodedToken = this.jwtHelper.decodeToken(token);
  }

  register(model: any) {
    return this.http.post(`${this.baseUrl}register`, model);
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    this.alertifyService.message('Logout');
    this.router.navigate(['/']);
  }
}
