import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { catchError, map } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';

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
    userParams?,
    likeParams?
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
    }

    if (likeParams === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likeParams === 'Likees') {
      params = params.append('likees', 'true');
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

  sendLike(id: number, recipientId: number) {
    return this.http
      .post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {})
      .pipe(
        map(() => this.alertifyService.success('You liked this user!')),
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
        })
      );
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {
        observe: 'response',
        params,
      })
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

  getMessageThread(id: number, recipientId: number) {
    return this.http
      .get<Message[]>(
        this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId
      )
      .pipe(
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
        })
      );
  }

  sendMessage(id: number, message: Message) {
    return this.http
      .post(this.baseUrl + 'users/' + id + '/messages', message)
      .pipe(
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
        })
      );
  }

  deleteMessage(id: number, userId: number) {
    return this.http
      .post(this.baseUrl + 'users/' + userId + '/messages/' + id, {})
      .pipe(
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
        })
      );
  }

  markAsRead(userId: number, messageId: number) {
    this.http
      .post(
        this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read',
        {}
      )
      .pipe(
        catchError((err) => {
          this.alertifyService.error(err);
          return of(null);
        })
      )
      .subscribe();
  }
}
