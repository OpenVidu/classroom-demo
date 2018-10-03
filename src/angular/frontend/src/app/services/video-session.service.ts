import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { PublisherProperties } from 'openvidu-browser';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Lesson } from '../models/lesson';
import { AuthenticationService } from './authentication.service';


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
        return observableThrowError(error)
    }

}
