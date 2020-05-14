import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { catchError, map } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private alertifyService: AlertifyService
  ) {}

  getUsers(
    page?,
    itemsPerPage?,
    userParams?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();
    let params = new HttpParams();

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
      console.log(userParams, params);
    }

    return this.http
      .get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination')) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        }),
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
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
