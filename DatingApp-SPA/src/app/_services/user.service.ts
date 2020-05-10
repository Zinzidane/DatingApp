import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { catchError, map } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alertifyService: AlertifyService
  ) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users').pipe(
      catchError((err) => {
        this.alertifyService.error(err);
        return of([]);
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id).pipe(
      catchError((err) => {
        this.alertifyService.error(err);
        return of(null);
      })
    );
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user).pipe(
      map(() => this.alertifyService.success('Profile updated!')),
      catchError((err) => {
        this.alertifyService.error(err);
        return of(null);
      })
    );
  }

  setMainPhoto(userId: number, id: number) {
    return this.http
      .post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {})
      .pipe(
        map(() => this.alertifyService.success('Avatar updated!')),
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
        })
      );
  }

  deletePhoto(userId: number, id: number) {
    return this.http
      .delete(this.baseUrl + 'users/' + userId + '/photos/' + id)
      .pipe(
        map(() => this.alertifyService.success('Photo was deleted!')),
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
        })
      );
  }
}
