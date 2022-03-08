import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user';


@Injectable()
export class UserService {

  private url = 'api-users';

  constructor(private http: HttpClient) { }

  newUser(name: string, pass: string, nickName: string, role: string) {
    const body = JSON.stringify([name, pass, nickName, role]);
    return this.http.post(this.url + '/new', body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).pipe(
        map(response => response as User),
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: any) {
    return observableThrowError(error.status);
  }
}
