import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Connection } from 'openvidu-browser';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user';


@Injectable()
export class AuthenticationService {

    private urlLogIn = 'api-logIn';
    private urlLogOut = 'api-logOut';

    public token: string;
    private user: User;
    private role: string;

    constructor(private http: HttpClient, private router: Router) {
        this.reqIsLogged();

        // set token if saved in local storage
        // let auth_token = JSON.parse(localStorage.getItem('auth_token'));
        // this.token = auth_token && auth_token.token;
    }

    logIn(user: string, pass: string) {

        console.log('Login service started...');

        return this.http.get(this.urlLogIn, {
            headers: {
                'Authorization': 'Basic ' + utf8_to_b64(user + ':' + pass),
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).pipe(
            map((response: User) => {
                this.processLogInResponse(response);
                return this.user;
            })
        );
    }

    logOut() {

        console.log('Logging out...');

        return this.http.get(this.urlLogOut)
            .pipe(
                map(response => {
                    console.log('Logout succesful!');

                    this.user = null;
                    this.role = null;

                    // clear token remove user from local storage to log user out and navigates to welcome page
                    this.token = null;
                    localStorage.removeItem('login');
                    localStorage.removeItem('rol');
                    this.router.navigate(['']);

                    return response;
                }),
                catchError(error => Observable.throw(error))
            );
    }

    directLogOut() {
        this.logOut().subscribe(
            response => { },
            error => console.log('Error when trying to log out: ' + error)
        );
    }

    private processLogInResponse(user: User) {
        // Correctly logged in
        console.log('Login succesful processing...');

        this.user = user;

        localStorage.setItem('login', 'OPENVIDUAPP');
        if (this.user.roles.indexOf('ROLE_TEACHER') !== -1) {
            this.role = 'ROLE_TEACHER';
            localStorage.setItem('rol', 'ROLE_TEACHER');
        }
        if (this.user.roles.indexOf('ROLE_STUDENT') !== -1) {
            this.role = 'ROLE_STUDENT';
            localStorage.setItem('rol', 'ROLE_STUDENT');
        }
    }

    reqIsLogged() {

        console.log('ReqIsLogged called');

        this.http.get(this.urlLogIn, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }).pipe(
            map((response: User) => this.processLogInResponse(response)),
            catchError(error => {
                if (error.status !== 401) {
                    console.error('Error when asking if logged: ' + JSON.stringify(error));
                    this.logOut();
                    return Observable.throw(error);
                }
            })
        );
    }

    checkCredentials() {
        if (!this.isLoggedIn()) {
            this.logOut();
        }
    }

    isLoggedIn() {
        return ((this.user != null) && (this.user !== undefined));
    }

    getCurrentUser() {
        return this.user;
    }

    isTeacher() {
        return ((this.user.roles.indexOf('ROLE_TEACHER')) !== -1) && (localStorage.getItem('rol') === 'ROLE_TEACHER');
    }

    isStudent() {
        return ((this.user.roles.indexOf('ROLE_STUDENT')) !== -1) && (localStorage.getItem('rol') === 'ROLE_STUDENT');
    }

    updateUserLessons(lessons) {
        this.getCurrentUser().lessons = lessons;
    }

    connectionBelongsToTeacher(connection: Connection) {
        return connection.data.indexOf('teacher@gmail.com') > -1;
    }
}

function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(<any>'0x' + p1);
    }));
}
