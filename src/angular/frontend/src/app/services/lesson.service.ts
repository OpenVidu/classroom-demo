import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import 'rxjs/Rx';
import { Lesson } from '../models/lesson';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';


@Injectable()
export class LessonService {

    private url = 'api-lessons';

    constructor(private http: Http, private authenticationService: AuthenticationService) { }

    getLessons(user: User) {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        const options = new RequestOptions({ headers });
        return this.http.get(this.url + '/user/' + user.id, options) // Must send userId
            .pipe(
                map((response: Response) => response.json() as Lesson[]),
                catchError(error => this.handleError(error))
            );
    }

    getLesson(lessonId: number) {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        const options = new RequestOptions({ headers });
        return this.http.get(this.url + '/lesson/' + lessonId, options) // Must send userId
            .pipe(
                map((response: Response) => response.json() as Lesson),
                catchError(error => this.handleError(error))
            );
    }

    // POST new lesson. On success returns the created lesson
    newLesson(lesson: Lesson) {
        const body = JSON.stringify(lesson);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        const options = new RequestOptions({ headers });
        return this.http.post(this.url + '/new', body, options)
            .pipe(
                map(response => response.json() as Lesson),
                catchError(error => this.handleError(error))
            );
    }

    // PUT existing lesson. On success returns the updated lesson
    editLesson(lesson: Lesson) {
        const body = JSON.stringify(lesson);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        const options = new RequestOptions({ headers });
        return this.http.put(this.url + '/edit', body, options)
            .pipe(
                map(response => response.json() as Lesson),
                catchError(error => this.handleError(error))
            );
    }

    // DELETE existing lesson. On success returns the deleted lesson (simplified version)
    deleteLesson(lessonId: number) {
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        const options = new RequestOptions({ headers });
        return this.http.delete(this.url + '/delete/' + lessonId, options)
            .pipe(
                map(response => response.json() as Lesson),
                catchError(error => this.handleError(error))
            );
    }

    // PUT existing lesson, modifying its attenders (adding them). On success returns the updated lesson.attenders array
    addLessonAttenders(lessonId: number, userEmails: string[]) {
        const body = JSON.stringify(userEmails);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        const options = new RequestOptions({ headers });
        return this.http.put(this.url + '/edit/add-attenders/lesson/' + lessonId, body, options)
            .pipe(
                map(response => response.json()),
                catchError(error => this.handleError(error))
            );
    }

    // PUT existing lesson, modifying its attenders (deleting them). On success returns the updated lesson.attenders array
    deleteLessonAttenders(lesson: Lesson) {
        const body = JSON.stringify(lesson);
        const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        const options = new RequestOptions({ headers });
        return this.http.put(this.url + '/edit/delete-attenders', body, options)
            .pipe(
                map(response => response.json() as User[]),
                catchError(error => this.handleError(error))
            );
    }

    obtainLocalLesson(id: number) {
        return this.authenticationService.getCurrentUser().lessons.find(lesson => lesson.id === id);
    }

    private handleError(error: any) {
        console.error(error);
        return observableThrowError('Server error (' + error.status + '): ' + error.text())
    }
}
