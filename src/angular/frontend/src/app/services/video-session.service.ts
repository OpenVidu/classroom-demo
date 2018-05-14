import { throwError as observableThrowError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Lesson } from '../models/lesson';

import { AuthenticationService } from './authentication.service';
import { PublisherProperties } from 'openvidu-browser';

@Injectable()
export class VideoSessionService {

    lesson: Lesson;
    cameraOptions: PublisherProperties;

    private url = 'api-sessions';

    constructor(private http: Http, private authenticationService: AuthenticationService) { }

    // Returns nothing (HttpResponse)
    createSession(lessonId: number) {
        const body = JSON.stringify(lessonId);
        return this.http.post(this.url + '/create-session', body)
            .pipe(
                map(response => { }),
                catchError(error => this.handleError(error))
            );
    }

    // Returns {0: sessionId, 1: token}
    generateToken(lessonId: number) {
        const body = JSON.stringify(lessonId);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers });
        return this.http.post(this.url + '/generate-token', body, options)
            .pipe(
                map(response => response.json()),
                catchError(error => this.handleError(error))
            );
    }

    removeUser(lessonId: number) {
        const body = JSON.stringify(lessonId);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers });
        return this.http.post(this.url + '/remove-user', body, options)
            .pipe(
                map(response => response),
                catchError(error => this.handleError(error))
            );
    }

    private handleError(error: any) {
        console.error(error);
        return observableThrowError('Server error (' + error.status + '): ' + error.text())
    }

}
