webpackJsonp([1,4],{

/***/ 1138:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(563);


/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_service__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LessonService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LessonService = (function () {
    function LessonService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.url = 'api-lessons';
    }
    LessonService.prototype.getLessons = function (user) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.get(this.url + '/user/' + user.id, options) // Must send userId
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    LessonService.prototype.getLesson = function (lessonId) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.get(this.url + '/lesson/' + lessonId, options) // Must send userId
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // POST new lesson. On success returns the created lesson
    LessonService.prototype.newLesson = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + '/new', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // PUT existing lesson. On success returns the updated lesson
    LessonService.prototype.editLesson = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.put(this.url + '/edit', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // DELETE existing lesson. On success returns the deleted lesson (simplified version)
    LessonService.prototype.deleteLesson = function (lessonId) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.delete(this.url + '/delete/' + lessonId, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // PUT existing lesson, modifying its attenders (adding them). On success returns the updated lesson.attenders array
    LessonService.prototype.addLessonAttenders = function (lessonId, userEmails) {
        var _this = this;
        var body = JSON.stringify(userEmails);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.put(this.url + '/edit/add-attenders/lesson/' + lessonId, body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // PUT existing lesson, modifying its attenders (deleting them). On success returns the updated lesson.attenders array
    LessonService.prototype.deleteLessonAttenders = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.put(this.url + '/edit/delete-attenders', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    LessonService.prototype.obtainLocalLesson = function (id) {
        return this.authenticationService.getCurrentUser().lessons.find(function (lesson) { return lesson.id == id; });
    };
    LessonService.prototype.handleError = function (error) {
        console.error(error);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw('Server error (' + error.status + '): ' + error.text());
    };
    LessonService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], LessonService);
    return LessonService;
    var _a, _b;
}());
//# sourceMappingURL=lesson.service.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_service__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VideoSessionService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var VideoSessionService = (function () {
    function VideoSessionService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.url = 'api-sessions';
    }
    // Returns {0: sessionId}
    VideoSessionService.prototype.createSession = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        return this.http.post(this.url + '/create-session', body)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    // Returns {0: sessionId, 1: token}
    VideoSessionService.prototype.generateToken = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + '/generate-token', body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    VideoSessionService.prototype.removeUser = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + '/remove-user', body, options)
            .map(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    VideoSessionService.prototype.handleError = function (error) {
        console.error(error);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw('Server error (' + error.status + '): ' + error.text());
    };
    VideoSessionService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], VideoSessionService);
    return VideoSessionService;
    var _a, _b;
}());
//# sourceMappingURL=video-session.service.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthenticationService = (function () {
    function AuthenticationService(http, router) {
        this.http = http;
        this.router = router;
        this.urlLogIn = 'api-logIn';
        this.urlLogOut = 'api-logOut';
        this.reqIsLogged();
        // set token if saved in local storage
        // let auth_token = JSON.parse(localStorage.getItem('auth_token'));
        // this.token = auth_token && auth_token.token;
    }
    AuthenticationService.prototype.logIn = function (user, pass) {
        var _this = this;
        console.log('Login service started...');
        var userPass = utf8_to_b64(user + ':' + pass);
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Headers */]({
            'Authorization': 'Basic ' + userPass,
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.get(this.urlLogIn, options)
            .map(function (response) {
            _this.processLogInResponse(response);
            return _this.user;
        })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"].throw(error); });
    };
    AuthenticationService.prototype.logOut = function () {
        var _this = this;
        console.log('Logging out...');
        return this.http.get(this.urlLogOut).map(function (response) {
            console.log('Logout succesful!');
            _this.user = null;
            _this.role = null;
            // clear token remove user from local storage to log user out and navigates to welcome page
            _this.token = null;
            localStorage.removeItem('login');
            localStorage.removeItem('rol');
            _this.router.navigate(['']);
            return response;
        })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_0_rxjs_Rx__["Observable"].throw(error); });
    };
    AuthenticationService.prototype.directLogOut = function () {
        this.logOut().subscribe(function (response) { }, function (error) { return console.log("Error when trying to log out: " + error); });
    };
    AuthenticationService.prototype.processLogInResponse = function (response) {
        // Correctly logged in
        console.log('Login succesful processing...');
        this.user = response.json();
        localStorage.setItem('login', 'OPENVIDUAPP');
        if (this.user.roles.indexOf('ROLE_TEACHER') !== -1) {
            this.role = 'ROLE_TEACHER';
            localStorage.setItem('rol', 'ROLE_TEACHER');
        }
        if (this.user.roles.indexOf('ROLE_STUDENT') !== -1) {
            this.role = 'ROLE_STUDENT';
            localStorage.setItem('rol', 'ROLE_STUDENT');
        }
    };
    AuthenticationService.prototype.reqIsLogged = function () {
        var _this = this;
        console.log('ReqIsLogged called');
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Headers */]({
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* RequestOptions */]({ headers: headers });
        this.http.get(this.urlLogIn, options).subscribe(function (response) { return _this.processLogInResponse(response); }, function (error) {
            if (error.status != 401) {
                console.error('Error when asking if logged: ' + JSON.stringify(error));
                _this.logOut();
            }
        });
    };
    AuthenticationService.prototype.checkCredentials = function () {
        if (!this.isLoggedIn()) {
            this.logOut();
        }
    };
    AuthenticationService.prototype.isLoggedIn = function () {
        return ((this.user != null) && (this.user !== undefined));
    };
    AuthenticationService.prototype.getCurrentUser = function () {
        return this.user;
    };
    AuthenticationService.prototype.isTeacher = function () {
        return ((this.user.roles.indexOf('ROLE_TEACHER')) !== -1) && (localStorage.getItem('rol') === 'ROLE_TEACHER');
    };
    AuthenticationService.prototype.isStudent = function () {
        return ((this.user.roles.indexOf('ROLE_STUDENT')) !== -1) && (localStorage.getItem('rol') === 'ROLE_STUDENT');
    };
    AuthenticationService.prototype.updateUserLessons = function (lessons) {
        this.getCurrentUser().lessons = lessons;
    };
    AuthenticationService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === 'function' && _b) || Object])
    ], AuthenticationService);
    return AuthenticationService;
    var _a, _b;
}());
function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
//# sourceMappingURL=authentication.service.js.map

/***/ }),

/***/ 477:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    AuthGuard.prototype.canActivate = function () {
        if (localStorage.getItem('login') && localStorage.getItem('rol') && this.authenticationService.isLoggedIn()) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['']);
        return false;
    };
    AuthGuard = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], AuthGuard);
    return AuthGuard;
    var _a, _b;
}());
//# sourceMappingURL=auth.guard.js.map

/***/ }),

/***/ 478:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_material__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_lesson__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_lesson_service__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_video_session_service__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__join_session_dialog_component__ = __webpack_require__(479);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var DashboardComponent = (function () {
    function DashboardComponent(lessonService, videoSessionService, authenticationService, router, snackBar, dialog) {
        this.lessonService = lessonService;
        this.videoSessionService = videoSessionService;
        this.authenticationService = authenticationService;
        this.router = router;
        this.snackBar = snackBar;
        this.dialog = dialog;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.authenticationService.checkCredentials();
        this.getLessons();
    };
    DashboardComponent.prototype.logout = function () {
        this.authenticationService.logOut();
    };
    DashboardComponent.prototype.getLessons = function () {
        var _this = this;
        this.lessonService.getLessons(this.authenticationService.getCurrentUser()).subscribe(function (lessons) {
            console.log('User\'s lessons: ');
            console.log(lessons);
            _this.lessons = lessons;
            _this.authenticationService.updateUserLessons(_this.lessons);
        }, function (error) { return console.log(error); });
    };
    DashboardComponent.prototype.goToLesson = function (lesson) {
        var _this = this;
        var dialogRef;
        dialogRef = this.dialog.open(__WEBPACK_IMPORTED_MODULE_7__join_session_dialog_component__["a" /* JoinSessionDialogComponent */]);
        dialogRef.componentInstance.myReference = dialogRef;
        dialogRef.afterClosed().subscribe(function (cameraOptions) {
            if (cameraOptions != null) {
                console.log('Joining session with options:');
                console.log(cameraOptions);
                _this.videoSessionService.lesson = lesson;
                _this.videoSessionService.cameraOptions = cameraOptions;
                _this.router.navigate(['/lesson/' + lesson.id]);
            }
        });
    };
    DashboardComponent.prototype.goToLessonDetails = function (lesson) {
        this.router.navigate(['/lesson-details/' + lesson.id]);
    };
    DashboardComponent.prototype.newLesson = function () {
        var _this = this;
        this.sumbitNewLesson = true;
        this.lessonService.newLesson(new __WEBPACK_IMPORTED_MODULE_3__models_lesson__["a" /* Lesson */](this.lessonTitle)).subscribe(function (lesson) {
            console.log('New lesson added: ');
            console.log(lesson);
            _this.lessons.push(lesson);
            _this.authenticationService.updateUserLessons(_this.lessons);
            _this.sumbitNewLesson = false;
            _this.snackBar.open('Lesson added!', undefined, { duration: 3000 });
            _this.addingLesson = false;
        }, function (error) {
            console.log(error);
            _this.sumbitNewLesson = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    DashboardComponent.prototype.createSession = function (lessonId) {
        this.videoSessionService.createSession(lessonId).subscribe(function (response) {
            console.log(response.text());
        }, function (error) {
            console.log(error);
        });
    };
    DashboardComponent.prototype.generateToken = function (lessonId) {
        this.videoSessionService.generateToken(lessonId).subscribe(function (response) {
            console.log(response.text());
        }, function (error) {
            console.log(error);
        });
    };
    DashboardComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-dashboard',
            template: __webpack_require__(826),
            styles: [__webpack_require__(796)],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__services_lesson_service__["a" /* LessonService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__services_lesson_service__["a" /* LessonService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__services_video_session_service__["a" /* VideoSessionService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__services_video_session_service__["a" /* VideoSessionService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_6__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MdSnackBar */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MdSnackBar */]) === 'function' && _e) || Object, (typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MdDialog */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MdDialog */]) === 'function' && _f) || Object])
    ], DashboardComponent);
    return DashboardComponent;
    var _a, _b, _c, _d, _e, _f;
}());
//# sourceMappingURL=dahsboard.component.js.map

/***/ }),

/***/ 479:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JoinSessionDialogComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var JoinSessionDialogComponent = (function () {
    function JoinSessionDialogComponent() {
        this.quality = 'medium';
        this.joinWithVideo = true;
        this.joinWithAudio = true;
    }
    JoinSessionDialogComponent.prototype.joinSession = function () {
        var cameraOptions = {
            audio: this.joinWithAudio,
            video: this.joinWithVideo,
            data: true,
            mediaConstraints: this.generateMediaConstraints()
        };
        this.myReference.close(cameraOptions);
    };
    JoinSessionDialogComponent.prototype.generateMediaConstraints = function () {
        var mediaConstraints = {
            audio: true,
            video: {}
        };
        var w = 640;
        var h = 480;
        switch (this.quality) {
            case 'low':
                w = 320;
                h = 240;
                break;
            case 'medium':
                w = 640;
                h = 480;
                break;
            case 'high':
                w = 1280;
                h = 720;
                break;
            case 'veryhigh':
                w = 1920;
                h = 1080;
                break;
        }
        mediaConstraints.video['width'] = { exact: w };
        mediaConstraints.video['height'] = { exact: h };
        //mediaConstraints.video['frameRate'] = { ideal: Number((<HTMLInputElement>document.getElementById('frameRate')).value) };
        return mediaConstraints;
    };
    JoinSessionDialogComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-join-session-dialog',
            template: "\n        <div>\n            <h1 md-dialog-title>\n                Video options\n            </h1>\n            <form #dialogForm (ngSubmit)=\"joinSession()\">\n                <md-dialog-content>\n                    <div id=\"quality-div\">\n                        <h5>Quality</h5>\n                        <md-radio-group [(ngModel)]=\"quality\" name=\"quality\" id=\"quality\">\n                            <md-radio-button value='low' title=\"320x240\">Low</md-radio-button>\n                            <md-radio-button value='medium' title=\"640x480\">Medium</md-radio-button>\n                            <md-radio-button value='high' title=\"1280x720\">High</md-radio-button>\n                            <md-radio-button value='veryhigh' title=\"1920x1080\">Very high</md-radio-button>\n                        </md-radio-group>\n                    </div>\n                    <div id=\"join-div\">\n                        <h5>Enter with active...</h5>\n                        <md-checkbox [(ngModel)]=\"joinWithVideo\" name=\"joinWithVideo\" id=\"joinWithVideo\">Video</md-checkbox>\n                        <md-checkbox [(ngModel)]=\"joinWithAudio\" name=\"joinWithAudio\">Audio</md-checkbox>\n                    </div>\n                </md-dialog-content>\n                <md-dialog-actions>\n                    <button md-button md-dialog-close>CANCEL</button>\n                    <button md-button id=\"join-btn\" type=\"submit\">JOIN</button>\n                </md-dialog-actions>\n            </form>\n        </div>\n    ",
            styles: ["\n        #quality-div {\n            margin-top: 20px;\n        }\n        #join-div {\n            margin-top: 25px;\n            margin-bottom: 20px;\n        }\n        #quality-tag {\n            display: block;\n        }\n        h5 {\n            margin-bottom: 10px;\n            text-align: left;\n        }\n        #joinWithVideo {\n            margin-right: 50px;\n        }\n        md-dialog-actions {\n            display: block;\n        }\n        #join-btn {\n            float: right;\n        }\n    "],
        }), 
        __metadata('design:paramtypes', [])
    ], JoinSessionDialogComponent);
    return JoinSessionDialogComponent;
}());
//# sourceMappingURL=join-session-dialog.component.js.map

/***/ }),

/***/ 480:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_material__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_lesson__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_user__ = __webpack_require__(738);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_lesson_service__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_authentication_service__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LessonDetailsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LessonDetailsComponent = (function () {
    function LessonDetailsComponent(lessonService, authenticationService, router, route, location, snackBar) {
        this.lessonService = lessonService;
        this.authenticationService = authenticationService;
        this.router = router;
        this.route = route;
        this.location = location;
        this.snackBar = snackBar;
        this.editingTitle = false;
        this.sumbitEditLesson = false;
        this.sumbitAddAttenders = false;
        this.arrayOfAttDels = [];
        // Feedback message parameters
        this.addAttendersCorrect = false;
        this.addAttendersError = false;
    }
    LessonDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .map(function (params) { return _this.lessonService.obtainLocalLesson(+params['id']); })
            .subscribe(function (lesson) { return _this.lesson = lesson; });
    };
    LessonDetailsComponent.prototype.editLesson = function () {
        var _this = this;
        if (this.titleEdited !== this.lesson.title) {
            this.sumbitEditLesson = true;
            var l = new __WEBPACK_IMPORTED_MODULE_4__models_lesson__["a" /* Lesson */](this.titleEdited);
            l.id = this.lesson.id;
            this.lessonService.editLesson(l).subscribe(function (lesson) {
                // Lesson has been updated
                console.log('Lesson edited: ');
                console.log(lesson);
                _this.lesson = lesson;
                _this.sumbitEditLesson = false;
                _this.editingTitle = false;
                _this.snackBar.open('Lesson edited!', undefined, { duration: 3000 });
            }, function (error) {
                console.log(error);
                _this.sumbitEditLesson = false;
                _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
            });
        }
        else {
            this.editingTitle = false; // The user has not modified the title
        }
    };
    LessonDetailsComponent.prototype.deleteLesson = function () {
        var _this = this;
        this.sumbitEditLesson = true;
        this.lessonService.deleteLesson(this.lesson.id).subscribe(function (lesson) {
            // Lesson has been deleted
            console.log('Lesson deleted');
            console.log(lesson);
            _this.sumbitEditLesson = false;
            _this.router.navigate(['/lessons']);
            _this.snackBar.open('Lesson deleted!', undefined, { duration: 3000 });
        }, function (error) {
            console.log(error);
            _this.sumbitEditLesson = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    LessonDetailsComponent.prototype.addLessonAttenders = function () {
        var _this = this;
        this.sumbitAddAttenders = true;
        this.lessonService.addLessonAttenders(this.lesson.id, [this.emailAttender]).subscribe(function (response) {
            console.log('Attender added');
            console.log(response);
            _this.sumbitAddAttenders = false;
            var newAttenders = response.attendersAdded;
            _this.lesson.attenders = _this.lesson.attenders.concat(newAttenders);
            _this.handleAttendersMessage(response);
        }, function (error) {
            console.log(error);
            _this.sumbitAddAttenders = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    LessonDetailsComponent.prototype.deleteLessonAttender = function (i, attender) {
        var _this = this;
        this.arrayOfAttDels[i] = true;
        var l = new __WEBPACK_IMPORTED_MODULE_4__models_lesson__["a" /* Lesson */](this.lesson.title);
        l.id = this.lesson.id;
        for (var i_1 = 0; i_1 < this.lesson.attenders.length; i_1++) {
            if (this.lesson.attenders[i_1].id !== attender.id) {
                l.attenders.push(new __WEBPACK_IMPORTED_MODULE_5__models_user__["a" /* User */](this.lesson.attenders[i_1])); //Inserting a new User object equal to the attender but "lessons" array empty
            }
        }
        this.lessonService.deleteLessonAttenders(l).subscribe(function (attenders) {
            console.log('Attender removed');
            console.log(attenders);
            _this.arrayOfAttDels[i] = false;
            _this.lesson.attenders = attenders;
            _this.snackBar.open('Attender removed!', undefined, { duration: 3000 });
        }, function (error) {
            console.log(error);
            _this.arrayOfAttDels[i] = false;
            _this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
        });
    };
    // Creates an error message when there is any problem during the process of adding Users to a Lesson
    // It also generates a correct feedback message when any student has been correctly added to the Lesson
    LessonDetailsComponent.prototype.handleAttendersMessage = function (response) {
        var isError = false;
        var isCorrect = false;
        this.attErrorContent = "";
        this.attCorrectContent = "";
        if (response.attendersAdded.length > 0) {
            for (var _i = 0, _a = response.attendersAdded; _i < _a.length; _i++) {
                var user = _a[_i];
                this.attCorrectContent += "<span class='feedback-list'>" + user.name + "</span>";
            }
            isCorrect = true;
        }
        if (response.attendersAlreadyAdded.length > 0) {
            this.attErrorContent += "<span>The following users were already added to the lesson</span>";
            for (var _b = 0, _c = response.attendersAlreadyAdded; _b < _c.length; _b++) {
                var user = _c[_b];
                this.attErrorContent += "<span class='feedback-list'>" + user.name + "</span>";
            }
            isError = true;
        }
        if (response.emailsValidNotRegistered.length > 0) {
            this.attErrorContent += "<span>The following users are not registered</span>";
            for (var _d = 0, _e = response.emailsValidNotRegistered; _d < _e.length; _d++) {
                var email = _e[_d];
                this.attErrorContent += "<span class='feedback-list'>" + email + "</span>";
            }
            isError = true;
        }
        if (response.emailsInvalid) {
            if (response.emailsInvalid.length > 0) {
                this.attErrorContent += "<span>These are not valid emails</span>";
                for (var _f = 0, _g = response.emailsInvalid; _f < _g.length; _f++) {
                    var email = _g[_f];
                    this.attErrorContent += "<span class='feedback-list'>" + email + "</span>";
                }
                isError = true;
            }
        }
        if (isError) {
            this.attErrorTitle = "There have been some problems";
            this.addAttendersError = true;
        }
        else if (response.attendersAdded.length == 0) {
            this.attErrorTitle = "No emails there!";
            this.addAttendersError = true;
        }
        if (isCorrect) {
            this.attCorrectTitle = "The following users where properly added";
            this.addAttendersCorrect = true;
        }
    };
    LessonDetailsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-lesson-details',
            template: __webpack_require__(828),
            styles: [__webpack_require__(798)],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_6__services_lesson_service__["a" /* LessonService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_6__services_lesson_service__["a" /* LessonService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_7__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_7__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common__["a" /* Location */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_common__["a" /* Location */]) === 'function' && _e) || Object, (typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_3__angular_material__["b" /* MdSnackBar */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__angular_material__["b" /* MdSnackBar */]) === 'function' && _f) || Object])
    ], LessonDetailsComponent);
    return LessonDetailsComponent;
    var _a, _b, _c, _d, _e, _f;
}());
//# sourceMappingURL=lesson-details.component.js.map

/***/ }),

/***/ 481:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_user_service__ = __webpack_require__(485);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PresentationComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PresentationComponent = (function () {
    function PresentationComponent(authenticationService, userService, router) {
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.router = router;
        this.roleUserSignup = 'student';
        this.loginView = true;
        this.tableShow = false;
    }
    PresentationComponent.prototype.ngOnInit = function () { };
    // If the user is loggedIn, navigates to dashboard
    PresentationComponent.prototype.ngAfterViewChecked = function () {
        if (this.authenticationService.isLoggedIn()) {
            this.router.navigate(['/lessons']);
        }
    };
    PresentationComponent.prototype.setLoginView = function (option) {
        this.fieldsIncorrect = false;
        this.loginView = option;
    };
    PresentationComponent.prototype.onSubmit = function () {
        console.log('Submit: email = ' + this.email + ' , password = ' + this.password + ', confirmPassword = ' + this.confirmPassword);
        this.submitProcessing = true;
        if (this.loginView) {
            // If login view is activated
            console.log('Logging in...');
            this.logIn(this.email, this.password);
        }
        else {
            // If signup view is activated
            console.log('Signing up...');
            this.signUp();
        }
    };
    PresentationComponent.prototype.logIn = function (user, pass) {
        var _this = this;
        this.authenticationService.logIn(user, pass).subscribe(function (result) {
            _this.submitProcessing = false;
            console.log('Login succesful! LOGGED AS ' + _this.authenticationService.getCurrentUser().name);
            // Login successful
            _this.fieldsIncorrect = false;
            _this.router.navigate(['/lessons']);
        }, function (error) {
            console.log('Login failed (error): ' + error);
            _this.errorTitle = 'Invalid field';
            _this.errorContent = 'Please check your email or password';
            _this.customClass = 'fail';
            // Login failed
            _this.handleError();
        });
    };
    PresentationComponent.prototype.signUp = function () {
        var _this = this;
        // Passwords don't match
        if (this.password !== this.confirmPassword) {
            this.errorTitle = 'Your passwords don\'t match!';
            this.errorContent = '';
            this.customClass = 'fail';
            this.handleError();
        }
        else {
            var userNameFixed_1 = this.email;
            var userPasswordFixed_1 = this.password;
            this.userService.newUser(userNameFixed_1, userPasswordFixed_1, this.nickName, this.roleUserSignup).subscribe(function (result) {
                // Sign up succesful
                _this.logIn(userNameFixed_1, userPasswordFixed_1);
                console.log('Sign up succesful!');
            }, function (error) {
                console.log('Sign up failed (error): ' + error);
                if (error === 409) {
                    _this.errorTitle = 'Invalid email';
                    _this.errorContent = 'That email is already in use';
                    _this.customClass = 'fail';
                }
                else if (error === 403) {
                    _this.errorTitle = 'Invalid email format';
                    _this.errorContent = 'Our server has rejected that email';
                    _this.customClass = 'fail';
                }
                // Sign up failed
                _this.handleError();
            });
        }
    };
    PresentationComponent.prototype.handleError = function () {
        this.submitProcessing = false;
        this.fieldsIncorrect = true;
    };
    PresentationComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-presentation',
            template: __webpack_require__(829),
            styles: [__webpack_require__(799)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_user_service__["a" /* UserService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__services_user_service__["a" /* UserService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _c) || Object])
    ], PresentationComponent);
    return PresentationComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=presentation.component.js.map

/***/ }),

/***/ 482:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_authentication_service__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ProfileComponent = (function () {
    function ProfileComponent(authenticationService) {
        this.authenticationService = authenticationService;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.user = this.authenticationService.getCurrentUser();
    };
    ProfileComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-profile',
            template: __webpack_require__(830),
            styles: [__webpack_require__(800)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _a) || Object])
    ], ProfileComponent);
    return ProfileComponent;
    var _a;
}());
//# sourceMappingURL=profile.component.js.map

/***/ }),

/***/ 483:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_openvidu_browser__ = __webpack_require__(821);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_openvidu_browser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_openvidu_browser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_video_session_service__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VideoSessionComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var VideoSessionComponent = (function () {
    function VideoSessionComponent(location, authenticationService, videoSessionService) {
        this.location = location;
        this.authenticationService = authenticationService;
        this.videoSessionService = videoSessionService;
    }
    VideoSessionComponent.prototype.OPEN_VIDU_CONNECTION = function () {
        // 0) Obtain 'sessionId' and 'token' from server
        // In this case, the method ngOnInit takes care of it
        var _this = this;
        // 1) Initialize OpenVidu and your Session
        this.OV = new __WEBPACK_IMPORTED_MODULE_2_openvidu_browser__["OpenVidu"]();
        this.session = this.OV.initSession(this.sessionId);
        // 2) Specify the actions when events take place
        this.session.on('streamCreated', function (event) {
            console.warn("STREAM CREATED!");
            console.warn(event.stream);
            _this.session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            });
        });
        this.session.on('streamDestroyed', function (event) {
            console.warn("STREAM DESTROYED!");
            console.warn(event.stream);
        });
        this.session.on('connectionCreated', function (event) {
            if (event.connection.connectionId == _this.session.connection.connectionId) {
                console.warn("YOUR OWN CONNECTION CREATED!");
            }
            else {
                console.warn("OTHER USER'S CONNECTION CREATED!");
            }
            console.warn(event.connection);
        });
        this.session.on('connectionDestroyed', function (event) {
            console.warn("OTHER USER'S CONNECTION DESTROYED!");
            console.warn(event.connection);
        });
        // 3) Connect to the session
        this.session.connect(this.token, "CLIENT:" + this.authenticationService.getCurrentUser().name, function (error) {
            // If the connection is successful, initialize a publisher and publish to the session
            if (!error) {
                if (_this.authenticationService.isTeacher()) {
                    // 4) Get your own camera stream with the desired resolution and publish it, only if the user is supposed to do so
                    _this.publisher = _this.OV.initPublisher('publisher', _this.cameraOptions);
                    _this.publisher.on('accessAllowed', function () {
                        console.warn("CAMERA ACCESS ALLOWED!");
                    });
                    _this.publisher.on('accessDenied', function () {
                        console.warn("CAMERA ACCESS DENIED!");
                    });
                    _this.publisher.on('streamCreated', function (event) {
                        console.warn("STREAM CREATED BY PUBLISHER!");
                        console.warn(event.stream);
                    });
                    // 5) Publish your stream
                    _this.session.publish(_this.publisher);
                }
            }
            else {
                console.log('There was an error connecting to the session:', error.code, error.message);
            }
        });
    };
    VideoSessionComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Specific aspects of this concrete application
        this.previousConnectionStuff();
        if (this.authenticationService.isTeacher()) {
            // If the user is the teacher: creates the session and gets a token (with PUBLISHER role)
            this.videoSessionService.createSession(this.lesson.id).subscribe(function (sessionId) {
                _this.sessionId = sessionId[0];
                _this.videoSessionService.generateToken(_this.lesson.id).subscribe(function (sessionIdAndToken) {
                    _this.token = sessionIdAndToken[1];
                    console.warn("Token: " + _this.token);
                    console.warn("SessionId: " + _this.sessionId);
                    _this.OPEN_VIDU_CONNECTION();
                }, function (error) {
                    console.log(error);
                });
            }, function (error) {
                console.log(error);
            });
        }
        else {
            // If the user is a student: gets a token (with SUBSCRIBER role)
            this.videoSessionService.generateToken(this.lesson.id).subscribe(function (sessionIdAndToken) {
                _this.sessionId = sessionIdAndToken[0];
                _this.token = sessionIdAndToken[1];
                console.warn("Token: " + _this.token);
                console.warn("SessionId: " + _this.sessionId);
                _this.OPEN_VIDU_CONNECTION();
            }, function (error) {
                console.log(error);
            });
        }
        // Specific aspects of this concrete application
        this.afterConnectionStuff();
    };
    VideoSessionComponent.prototype.ngAfterViewInit = function () {
        this.toggleScrollPage("hidden");
    };
    VideoSessionComponent.prototype.ngOnDestroy = function () {
        this.videoSessionService.removeUser(this.lesson.id).subscribe(function (response) {
            console.warn("You have succesfully left the lesson");
        }, function (error) {
            console.log(error);
        });
        this.toggleScrollPage("auto");
        this.exitFullScreen();
        if (this.OV)
            this.session.disconnect();
    };
    VideoSessionComponent.prototype.toggleScrollPage = function (scroll) {
        var content = document.getElementsByClassName("mat-sidenav-content")[0];
        content.style.overflow = scroll;
    };
    VideoSessionComponent.prototype.toggleLocalVideo = function () {
        this.localVideoActivated = !this.localVideoActivated;
        this.publisher.publishVideo(this.localVideoActivated);
        this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
    };
    VideoSessionComponent.prototype.toggleLocalAudio = function () {
        this.localAudioActivated = !this.localAudioActivated;
        this.publisher.publishAudio(this.localAudioActivated);
        this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
    };
    VideoSessionComponent.prototype.toggleFullScreen = function () {
        var document = window.document;
        var fs = document.getElementsByTagName('html')[0];
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {
            console.log("enter FULLSCREEN!");
            this.fullscreenIcon = 'fullscreen_exit';
            if (fs.requestFullscreen) {
                fs.requestFullscreen();
            }
            else if (fs.msRequestFullscreen) {
                fs.msRequestFullscreen();
            }
            else if (fs.mozRequestFullScreen) {
                fs.mozRequestFullScreen();
            }
            else if (fs.webkitRequestFullscreen) {
                fs.webkitRequestFullscreen();
            }
        }
        else {
            console.log("exit FULLSCREEN!");
            this.fullscreenIcon = 'fullscreen';
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };
    VideoSessionComponent.prototype.exitFullScreen = function () {
        var document = window.document;
        var fs = document.getElementsByTagName('html')[0];
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    };
    VideoSessionComponent.prototype.previousConnectionStuff = function () {
        this.lesson = this.videoSessionService.lesson;
        this.cameraOptions = this.videoSessionService.cameraOptions;
    };
    VideoSessionComponent.prototype.afterConnectionStuff = function () {
        this.localVideoActivated = this.cameraOptions.video;
        this.localAudioActivated = this.cameraOptions.audio;
        this.videoIcon = this.localVideoActivated ? "videocam" : "videocam_off";
        this.audioIcon = this.localAudioActivated ? "mic" : "mic_off";
        this.fullscreenIcon = "fullscreen";
    };
    VideoSessionComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-video-session',
            template: __webpack_require__(831),
            styles: [__webpack_require__(801)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* Location */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* Location */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__services_video_session_service__["a" /* VideoSessionService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__services_video_session_service__["a" /* VideoSessionService */]) === 'function' && _c) || Object])
    ], VideoSessionComponent);
    return VideoSessionComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=video-session.component.js.map

/***/ }),

/***/ 484:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Lesson; });
var Lesson = (function () {
    function Lesson(title) {
        this.title = title;
        this.attenders = [];
    }
    return Lesson;
}());
//# sourceMappingURL=lesson.js.map

/***/ }),

/***/ 485:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.url = 'api-users';
    }
    UserService.prototype.newUser = function (name, pass, nickName, role) {
        var _this = this;
        var body = JSON.stringify([name, pass, nickName, role]);
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* RequestOptions */]({ headers: headers });
        return this.http.post(this.url + "/new", body, options)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    UserService.prototype.handleError = function (error) {
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.status);
    };
    UserService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object])
    ], UserService);
    return UserService;
    var _a;
}());
//# sourceMappingURL=user.service.js.map

/***/ }),

/***/ 562:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 562;


/***/ }),

/***/ 563:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(704);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(735);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(739);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 734:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    AppComponent.prototype.isVideoSessionUrl = function () {
        return (this.router.url.substring(0, '/lesson/'.length) === '/lesson/');
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(825),
            styles: [__webpack_require__(795)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_authentication_service__["a" /* AuthenticationService */]) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 735:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_routing__ = __webpack_require__(736);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__ = __webpack_require__(653);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs__ = __webpack_require__(803);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__(734);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_presentation_presentation_component__ = __webpack_require__(481);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_dashboard_dahsboard_component__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_lesson_details_lesson_details_component__ = __webpack_require__(480);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_profile_profile_component__ = __webpack_require__(482);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_video_session_video_session_component__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_error_message_error_message_component__ = __webpack_require__(737);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_dashboard_join_session_dialog_component__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_authentication_service__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_user_service__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_lesson_service__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_video_session_service__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__auth_guard__ = __webpack_require__(477);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_9__components_presentation_presentation_component__["a" /* PresentationComponent */],
                __WEBPACK_IMPORTED_MODULE_10__components_dashboard_dahsboard_component__["a" /* DashboardComponent */],
                __WEBPACK_IMPORTED_MODULE_11__components_lesson_details_lesson_details_component__["a" /* LessonDetailsComponent */],
                __WEBPACK_IMPORTED_MODULE_12__components_profile_profile_component__["a" /* ProfileComponent */],
                __WEBPACK_IMPORTED_MODULE_13__components_video_session_video_session_component__["a" /* VideoSessionComponent */],
                __WEBPACK_IMPORTED_MODULE_14__components_error_message_error_message_component__["a" /* ErrorMessageComponent */],
                __WEBPACK_IMPORTED_MODULE_15__components_dashboard_join_session_dialog_component__["a" /* JoinSessionDialogComponent */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_material__["a" /* MaterialModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_flex_layout__["FlexLayoutModule"].forRoot(),
                __WEBPACK_IMPORTED_MODULE_4__app_routing__["a" /* routing */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_16__services_authentication_service__["a" /* AuthenticationService */],
                __WEBPACK_IMPORTED_MODULE_17__services_user_service__["a" /* UserService */],
                __WEBPACK_IMPORTED_MODULE_18__services_lesson_service__["a" /* LessonService */],
                __WEBPACK_IMPORTED_MODULE_19__services_video_session_service__["a" /* VideoSessionService */],
                __WEBPACK_IMPORTED_MODULE_20__auth_guard__["a" /* AuthGuard */],
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_15__components_dashboard_join_session_dialog_component__["a" /* JoinSessionDialogComponent */],
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 736:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_presentation_presentation_component__ = __webpack_require__(481);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_dashboard_dahsboard_component__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_lesson_details_lesson_details_component__ = __webpack_require__(480);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_profile_profile_component__ = __webpack_require__(482);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_video_session_video_session_component__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__auth_guard__ = __webpack_require__(477);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });







var appRoutes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_1__components_presentation_presentation_component__["a" /* PresentationComponent */],
        pathMatch: 'full',
    },
    {
        path: 'lessons',
        component: __WEBPACK_IMPORTED_MODULE_2__components_dashboard_dahsboard_component__["a" /* DashboardComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'lesson-details/:id',
        component: __WEBPACK_IMPORTED_MODULE_3__components_lesson_details_lesson_details_component__["a" /* LessonDetailsComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'profile',
        component: __WEBPACK_IMPORTED_MODULE_4__components_profile_profile_component__["a" /* ProfileComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'lesson/:id',
        component: __WEBPACK_IMPORTED_MODULE_5__components_video_session_video_session_component__["a" /* VideoSessionComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_6__auth_guard__["a" /* AuthGuard */]]
    },
];
var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["b" /* RouterModule */].forRoot(appRoutes, { useHash: true });
//# sourceMappingURL=app.routing.js.map

/***/ }),

/***/ 737:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ErrorMessageComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ErrorMessageComponent = (function () {
    function ErrorMessageComponent() {
        this.eventShowable = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* EventEmitter */]();
    }
    ErrorMessageComponent.prototype.closeAlert = function () {
        this.eventShowable.emit(false);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', String)
    ], ErrorMessageComponent.prototype, "errorTitle", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', String)
    ], ErrorMessageComponent.prototype, "errorContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', String)
    ], ErrorMessageComponent.prototype, "customClass", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], ErrorMessageComponent.prototype, "closable", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["y" /* Input */])(), 
        __metadata('design:type', Number)
    ], ErrorMessageComponent.prototype, "timeable", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Output */])(), 
        __metadata('design:type', Object)
    ], ErrorMessageComponent.prototype, "eventShowable", void 0);
    ErrorMessageComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* Component */])({
            selector: 'app-error-message',
            template: __webpack_require__(827),
            styles: [__webpack_require__(797)]
        }), 
        __metadata('design:paramtypes', [])
    ], ErrorMessageComponent);
    return ErrorMessageComponent;
}());
//# sourceMappingURL=error-message.component.js.map

/***/ }),

/***/ 738:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
var User = (function () {
    function User(u) {
        this.id = u.id;
        this.name = u.name;
        this.nickName = u.nickName;
        this.roles = u.roles;
        this.lessons = [];
    }
    return User;
}());
//# sourceMappingURL=user.js.map

/***/ }),

/***/ 739:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    URL_BACK: 'https://localhost:5000'
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 795:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, "md-sidenav {\n  width: 250px;\n}\n\nmd-sidenav-container {\n  height: 100%;\n}\n\nfooter.page-footer {\n  margin: 0;\n}\n\nfooter h2 {\n  margin-top: 10px;\n}\n\n.sidenav-button {\n  width: 100%;\n}\n\nheader .fill-remaining-space {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\nheader #navbar-logo {\n  font-weight: bold;\n}\n\nfooter ul {\n  padding-left: 0;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 796:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, "md-card {\n  margin-top: 20px;\n}\n\nmd-card md-icon {\n  text-align: center;\n}\n\nspan.teacher {\n  font-size: 12px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 797:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, ".fail {\n  background-color: rgba(167, 56, 65, 0.2);\n  color: #a73841;\n}\n\n.warning {\n  background-color: rgba(175, 110, 0, 0.2);\n  color: #af6e00;\n}\n\n.correct {\n  background-color: rgba(55, 86, 70, 0.25);\n  color: #375546;\n}\n\nmd-icon {\n  cursor: pointer;\n  float: right;\n}\n\nmd-card {\n  max-width: 400px;\n  margin-top: 20px;\n  margin-bottom: 20px;\n  box-shadow: none;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 798:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, ".attender-email {\n  font-size: 11px;\n}\n\n.no-margin-bottom {\n  margin-bottom: 0 !important;\n}\n\n.attender-row {\n  width: 100%;\n  margin-top: 20px;\n  min-height: 27px;\n}\n\n#new-attender-title {\n  margin-bottom: 5px;\n}\n\n\n/*Rotating animation*/\n\n@-webkit-keyframes rotating\n/* Safari and Chrome */\n\n{\n  from {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n}\n\n@keyframes rotating {\n  from {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n}\n\n.rotating {\n  -webkit-animation: rotating 1s linear infinite;\n  animation: rotating 1s linear infinite;\n  cursor: default !important;\n}\n\n.rotating:hover {\n  color: inherit !important;\n}\n\n\n/*End rotating animation*/\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 799:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, "h1 {\n  text-align: center;\n  display: block;\n}\n\nmd-input-container {\n  width: 100%;\n}\n\nmd-card-actions {\n  padding-left: 10px;\n  padding-right: 10px;\n  color: #9e9e9e;\n}\n\n.btn-container {\n  text-align: center;\n  padding-top: 20px;\n}\n\n.card-button {\n  margin-left: 10px !important;\n}\n\n.radio-button-div {\n  text-align: center;\n  margin-bottom: 10px;\n}\n\n#sign-up-as {\n  color: #9e9e9e;\n  display: block;\n  margin-top: 15px;\n  margin-bottom: 10px;\n}\n\ntable {\n  margin: 0 auto;\n  margin-top: 20px;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 800:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, "table {\n  margin-top: 15px;\n  border-collapse: separate;\n  border-spacing: 15px 17px;\n}\n\nth {\n  text-align: left;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 801:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(49)();
// imports


// module
exports.push([module.i, "h1 {\n  text-align: center;\n  margin: 0;\n  color: white;\n}\n\n#header-div {\n  position: absolute;\n  z-index: 1000;\n  width: 100%;\n  background: rgba(0, 0, 0, 0.4);\n}\n\nmd-icon {\n  font-size: 38px;\n  width: 38px;\n  height: 38px;\n  color: white;\n  transition: color .2s linear;\n}\n\nmd-icon:hover {\n  color: #ffd740;\n}\n\n#back-btn {\n  float: left;\n}\n\n.right-btn {\n  float: right;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 825:
/***/ (function(module, exports) {

module.exports = "<md-sidenav-container>\n\n  <md-sidenav #sidenav>\n    <button md-button (click)=\"router.navigate(['/lessons']); sidenav.close()\" class=\"sidenav-button\">Lessons</button>\n    <button md-button (click)=\"router.navigate(['/profile']); sidenav.close()\" class=\"sidenav-button\">Profile</button>\n    <button md-button (click)=\"sidenav.close(); authenticationService.directLogOut()\" class=\"sidenav-button\">Logout</button>\n  </md-sidenav>\n\n  <header *ngIf=\"!isVideoSessionUrl()\">\n    <md-toolbar color=\"primary\" class=\"mat-elevation-z6\">\n      <button md-button routerLink=\"/\" id=\"navbar-logo\">\n        OpenVidu Classroom Demo\n      </button>\n      <span class=\"fill-remaining-space\"></span>\n      <div *ngIf=\"authenticationService.isLoggedIn()\" fxLayout=\"row\" fxShow=\"false\" fxShow.gt-sm>\n        <button md-button routerLink=\"/lessons\">Lessons</button>\n        <button md-button routerLink=\"/profile\">Profile</button>\n        <button md-button (click)=\"authenticationService.directLogOut()\">LOGOUT</button>\n      </div>\n      <button *ngIf=\"authenticationService.isLoggedIn()\" md-button fxHide=\"false\" fxHide.gt-sm (click)=\"sidenav.open()\">\n        <md-icon>menu</md-icon>\n      </button>\n    </md-toolbar>\n  </header>\n\n  <main>\n    <router-outlet></router-outlet>\n  </main>\n\n  <footer *ngIf=\"!isVideoSessionUrl()\" class=\"page-footer back-primary color-secondary mat-elevation-z5\">\n    <div class=\"container\">\n      <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"start start\" fxLayoutAlign.xs=\"start\">\n        <div fxFlex=\"50%\" fxFlex.xs=\"100%\">\n          <h2>This is a sample application</h2>\n          <p class=\"grey-text text-lighten-4\">Implementing a secure real time app with OpenVidu</p>\n        </div>\n        <div fxFlex=\"50%\" fxFlex.xs=\"100%\">\n          <div fxLayout=\"row\" fxLayoutAlign=\"end start\" fxLayoutAlign.xs=\"start\">\n            <div fxFlex=\"50%\">\n              <h2>Technologies</h2>\n              <ul>\n                <li><a class=\"hover-link\" href=\"https://angular.io/\" target=\"_blank\">Angular</a></li>\n                <li><a class=\"hover-link\" href=\"https://material.angular.io/\" target=\"_blank\">Angular Material</a></li>\n                <li><a class=\"hover-link\" href=\"https://spring.io/\" target=\"_blank\">Spring Framework</a></li>\n                <li><a class=\"hover-link\" href=\"https://www.kurento.org/\" target=\"_blank\">Kurento</a></li>\n              </ul>\n            </div>\n            <div fxFlex=\"50%\">\n              <h2>Connect</h2>\n              <ul>\n                <li><a class=\"hover-link\" href=\"https://github.com/OpenVidu\" target=\"_blank\">GitHub repository</a></li>\n              </ul>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </footer>\n\n</md-sidenav-container>\n"

/***/ }),

/***/ 826:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!this.lessons\" class=\"cssload-container\">\n  <div class=\"cssload-tube-tunnel\"></div>\n</div>\n\n<div *ngIf=\"this.lessons\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div *ngIf=\"!addingLesson\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <div fxFlex=\"80%\">MY LESSONS</div>\n      <md-icon fxFlex=\"20%\" fxLayoutAlign=\"end center\" *ngIf=\"authenticationService.isTeacher()\" (click)=\"addingLesson = true\"\n        [title]=\"'Add lesson'\">add_circle_outline</md-icon>\n    </div>\n\n    <div *ngIf=\"addingLesson\">\n      <div>NEW LESSON</div>\n      <form #newLessonForm (ngSubmit)=\"newLesson(); newLessonForm.reset()\" [class.filtered]=\"sumbitNewLesson\">\n        <md-input-container>\n          <input mdInput placeholder=\"Title\" [(ngModel)]=\"lessonTitle\" name=\"lessonTitle\" id=\"lessonTitle\" type=\"text\" autocomplete=\"off\"\n            required>\n        </md-input-container>\n        <div class=\"block-btn\">\n          <button md-button type=\"submit\" [disabled]=\"sumbitNewLesson\">Send</button>\n          <button md-button (click)=\"addingLesson = false; newLessonForm.reset()\" [disabled]=\"sumbitNewLesson\">Cancel</button>\n        </div>\n      </form>\n    </div>\n\n    <md-card *ngFor=\"let lesson of lessons\">\n      <div fxLayout=\"row\" fxLayoutAlign=\"center center\" fxLayoutGap=\"10px\">\n        <span fxFlex=\"70%\" class=\"title\">{{lesson.title}}</span>\n        <span fxFlex=\"70%\" *ngIf=\"this.authenticationService.isStudent()\" class=\"teacher\">{{lesson.teacher.nickName}}</span>\n        <md-icon fxFlex=\"15%\" *ngIf=\"this.authenticationService.isTeacher()\" (click)=\"goToLessonDetails(lesson)\" [title]=\"'Modify lesson'\">mode_edit</md-icon>\n        <md-icon fxFlex=\"15%\" (click)=\"goToLesson(lesson)\" [title]=\"'Go to lesson!'\">play_circle_filled</md-icon>\n      </div>\n    </md-card>\n\n    <div *ngIf=\"lessons.length === 0 && authenticationService.isStudent() && !addingLesson\">\n      <app-error-message [errorTitle]=\"'You do not have any lessons'\" [errorContent]=\"'Your teacher must invite you'\" [customClass]=\"'warning'\"\n        [closable]=\"false\"></app-error-message>\n    </div>\n\n    <div *ngIf=\"lessons.length === 0 && authenticationService.isTeacher() && !addingLesson\">\n      <app-error-message [errorTitle]=\"'You do not have any lessons'\" [errorContent]=\"'You can add one by clicking on the icon above'\"\n        [customClass]=\"'warning'\" [closable]=\"false\"></app-error-message>\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 827:
/***/ (function(module, exports) {

module.exports = "<md-card [ngClass]=\"customClass\">\n  <md-icon *ngIf=\"closable\" (click)=\"closeAlert()\">clear</md-icon>\n  <md-card-title>{{this.errorTitle}}</md-card-title>\n  <md-card-subtitle [innerHTML]=\"this.errorContent\"></md-card-subtitle>\n</md-card>\n"

/***/ }),

/***/ 828:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"lesson\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div *ngIf=\"!editingTitle\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <md-icon fxFlex=\"15%\" fxLayoutAlign=\"start center\" (click)=\"router.navigate(['/lessons'])\" [title]=\"'Back to lessons'\">keyboard_arrow_left</md-icon>\n      <h2 fxFlex=\"70%\">{{lesson.title}}</h2>\n      <md-icon fxFlex=\"15%\" fxLayoutAlign=\"end center\" (click)=\"editingTitle = true; titleEdited = lesson.title\" [title]=\"'Edit lesson'\">mode_edit</md-icon>\n    </div>\n\n    <div *ngIf=\"editingTitle\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n      <form #editLessonForm (ngSubmit)=\"editLesson(); editLessonForm.reset()\" [class.filtered]=\"sumbitEditLesson\">\n        <md-input-container>\n          <input mdInput placeholder=\"Title\" [(ngModel)]=\"titleEdited\" name=\"lessonTitle\" type=\"text\" autocomplete=\"off\" required>\n        </md-input-container>\n        <div class=\"block-btn\">\n          <button md-button type=\"submit\" [disabled]=\"sumbitEditLesson\">Send</button>\n          <a md-button (click)=\"editingTitle = false; titleEdited = ''\" [disabled]=\"sumbitEditLesson\">Cancel</a>\n          <a md-button (click)=\"deleteLesson()\" [disabled]=\"sumbitEditLesson\">Delete lesson</a>\n        </div>\n      </form>\n    </div>\n\n    <form #addAttendersForm (ngSubmit)=\"addLessonAttenders(); addAttendersForm.reset()\" [class.filtered]=\"sumbitAddAttenders\">\n      <h4 id=\"new-attender-title\">New attender</h4>\n      <md-input-container>\n        <input mdInput placeholder=\"Email\" [(ngModel)]=\"emailAttender\" name=\"attenderEmail\" type=\"text\" autocomplete=\"off\" required>\n      </md-input-container>\n      <div class=\"block-btn\">\n        <button md-button type=\"submit\" [disabled]=\"sumbitAddAttenders\">Send</button>\n        <a md-button (click)=\"addAttendersForm.reset()\" [disabled]=\"sumbitAddAttenders || emailAttender == null\">Cancel</a>\n      </div>\n    </form>\n\n    <app-error-message *ngIf=\"addAttendersCorrect\" (eventShowable)=\"addAttendersCorrect = false\" [errorTitle]=\"attCorrectTitle\"\n      [errorContent]=\"attCorrectContent\" [customClass]=\"'correct'\" [closable]=\"true\"></app-error-message>\n    <app-error-message *ngIf=\"addAttendersError\" (eventShowable)=\"addAttendersError = false\" [errorTitle]=\"attErrorTitle\" [errorContent]=\"attErrorContent\"\n      [customClass]=\"'fail'\" [closable]=\"true\"></app-error-message>\n\n    <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutGap=\"20px\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\"\n      class=\"attender-row\">\n      <div fxFlex=\"90%\" class=\"no-margin-bottom\">\n        <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\">\n          <div class=\"no-margin-bottom\" fxFlex>{{authenticationService.getCurrentUser().nickName}}</div>\n          <div class=\"attender-email\" fxFlex>{{authenticationService.getCurrentUser().name}}</div>\n        </div>\n      </div>\n      <div fxFlex=\"10%\"></div>\n    </div>\n    <div *ngFor=\"let attender of lesson.attenders; let i = index\">\n      <div *ngIf=\"attender.id != authenticationService.getCurrentUser().id\" fxLayout=\"row\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\"\n        class=\"attender-row\">\n        <div fxFlex=\"90%\">\n          <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\">\n            <div class=\"no-margin-bottom\" fxFlex>{{attender.nickName}}</div>\n            <div class=\"attender-email\" fxFlex>{{attender.name}}</div>\n          </div>\n        </div>\n        <div fxFlex=\"10%\">\n          <md-icon *ngIf=\"!this.arrayOfAttDels[i]\" (click)=\"deleteLessonAttender(i, attender)\" [title]=\"'Remove attender'\">clear</md-icon>\n          <md-icon *ngIf=\"this.arrayOfAttDels[i]\" class=\"rotating\">cached</md-icon>\n        </div>\n      </div>\n    </div>\n    \n  </div>\n</div>\n"

/***/ }),

/***/ 829:
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <h1>OpenVidu Classroom Demo</h1>\n\n    <div fxLayout=\"column\" fxLayoutAlign=\"space-around center\">\n\n      <md-card>\n        <md-card-content>\n\n          <div *ngIf=\"submitProcessing\" class=\"cssload-container\">\n            <div class=\"cssload-tube-tunnel\"></div>\n          </div>\n\n          <form #myForm (ngSubmit)=\"onSubmit()\" [class.filtered]=\"submitProcessing\">\n\n            <div>\n              <md-input-container>\n                <input mdInput placeholder=\"Email\" [(ngModel)]=\"email\" name=\"email\" id=\"email\" type=\"email\" required>\n              </md-input-container>\n            </div>\n\n            <div *ngIf=\"!loginView\">\n              <md-input-container>\n                <input mdInput placeholder=\"Name\" [(ngModel)]=\"nickName\" name=\"nickName\" id=\"nickName\" type=\"text\" autocomplete=\"off\" required>\n              </md-input-container>\n            </div>\n\n            <div>\n              <md-input-container>\n                <input mdInput placeholder=\"Password\" [(ngModel)]=\"password\" name=\"password\" id=\"password\" type=\"password\" required>\n              </md-input-container>\n            </div>\n\n            <div *ngIf=\"!loginView\">\n              <md-input-container>\n                <input mdInput placeholder=\"Confirm password\" [(ngModel)]=\"confirmPassword\" name=\"confirmPassword\" id=\"confirmPassword\" type=\"password\"\n                  autocomplete=\"off\" required>\n              </md-input-container>\n            </div>\n\n            <div *ngIf=\"!loginView\" class=\"radio-button-div\">\n              <span id=\"sign-up-as\">Sign up as...</span>\n              <md-radio-group [(ngModel)]=\"roleUserSignup\" name=\"roleUserSignup\" id=\"roleUserSignup\">\n                <md-radio-button value='student'>Student</md-radio-button>\n                <md-radio-button value='teacher'>Teacher</md-radio-button>\n              </md-radio-group>\n            </div>\n\n            <app-error-message *ngIf=\"fieldsIncorrect\" (eventShowable)=\"fieldsIncorrect = false\" [errorTitle]=\"errorTitle\" [errorContent]=\"errorContent\"\n              [customClass]=\"customClass\" [closable]=\"true\"></app-error-message>\n\n            <div class=\"btn-container\">\n              <button md-raised-button color=\"accent\" type=\"submit\" *ngIf=\"loginView\" id=\"log-in-btn\">Log in</button>\n              <button md-icon-button *ngIf=\"loginView\" type=\"button\" (click)=\"tableShow=!tableShow\" mdTooltip=\"Show registered users\" mdTooltipPosition=\"right\"><md-icon>info_outline</md-icon></button>\n              <button md-raised-button color=\"primary\" type=\"submit\" *ngIf=\"!loginView\" id=\"sign-up-btn\">Sign up</button>\n            </div>\n\n          </form>\n\n          <div *ngIf=\"loginView && tableShow\">\n            <table>\n              <tr>\n                <th>Email</th>\n                <th>Password</th>\n              </tr>\n              <tr>\n                <td>teacher@gmail.com</td>\n                <td>pass</td>\n              </tr>\n              <tr>\n                <td>student1@gmail.com</td>\n                <td>pass</td>\n              </tr>\n              <tr>\n                <td>student2@gmail.com</td>\n                <td>pass</td>\n              </tr>\n            </table>\n          </div>\n\n        </md-card-content>\n\n        <md-card-actions>\n          <div *ngIf=\"loginView\">Not registered yet?<button md-button (click)=\"setLoginView(false); tableShow=false; myForm.reset()\" class=\"card-button\">Sign up</button></div>\n          <div *ngIf=\"!loginView\">Already registered?<button md-button (click)=\"setLoginView(true); myForm.reset()\" class=\"card-button\">Log in</button></div>\n        </md-card-actions>\n\n      </md-card>\n\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ 830:
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div>MY PROFILE</div>\n    <table>\n      <tr>\n        <td>Name</td>\n        <th>{{authenticationService.getCurrentUser().nickName}}</th>\n      </tr>\n      <tr>\n        <td>Email</td>\n        <th>{{authenticationService.getCurrentUser().name}}</th>\n      </tr>\n    </table>\n    \n  </div>\n</div>\n"

/***/ }),

/***/ 831:
/***/ (function(module, exports) {

module.exports = "<div id=\"header-div\">\n    <md-icon id=\"back-btn\" (click)=\"location.back()\" [title]=\"'Back to lessons'\">keyboard_arrow_left</md-icon>\n    <md-icon class=\"right-btn\" (click)=\"toggleFullScreen()\" [title]=\"'Fullscreen'\">{{fullscreenIcon}}</md-icon>\n    <md-icon class=\"right-btn\" (click)=\"toggleLocalVideo()\" [title]=\"'Toggle video'\">{{videoIcon}}</md-icon>\n    <md-icon class=\"right-btn\" (click)=\"toggleLocalAudio()\" [title]=\"'Toggle audio'\">{{audioIcon}}</md-icon>\n    <h1>{{lesson?.title}}</h1>\n</div>\n<div id=\"publisher\"></div>\n<div id=\"subscriber\"></div>"

/***/ })

},[1138]);
//# sourceMappingURL=main.bundle.js.map