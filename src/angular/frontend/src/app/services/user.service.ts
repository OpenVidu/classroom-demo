import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user';


@Injectable()
export class UserService {

  private url = 'api-users';

  constructor(private http: Http) { }

  newUser(name: string, pass: string, nickName: string, role: string) {
    const body = JSON.stringify([name, pass, nickName, role]);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    const options = new RequestOptions({ headers });
    return this.http.post(this.url + '/new', body, options)
      .pipe(
        map(response => response.json() as User),
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: any) {
    return observableThrowError(error.status);
  }
}
