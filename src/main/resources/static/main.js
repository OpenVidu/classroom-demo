(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-sidenav {\n  width: 250px;\n}\n\nmat-sidenav-container {\n  height: 100%;\n}\n\nfooter.page-footer {\n  margin: 0;\n}\n\nfooter h2 {\n  margin-top: 10px;\n}\n\n.sidenav-button {\n  width: 100%;\n}\n\nheader .fill-remaining-space {\n  flex: 1 1 auto;\n}\n\nheader #navbar-logo {\n  font-weight: bold;\n}\n\nfooter ul {\n  padding-left: 0;\n}\n"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-sidenav-container>\n\n  <mat-sidenav #sidenav>\n    <button mat-button (click)=\"router.navigate(['/lessons']); sidenav.close()\" class=\"sidenav-button\">Lessons</button>\n    <button mat-button (click)=\"router.navigate(['/profile']); sidenav.close()\" class=\"sidenav-button\">Profile</button>\n    <button mat-button (click)=\"sidenav.close(); authenticationService.directLogOut()\" class=\"sidenav-button\">Logout</button>\n  </mat-sidenav>\n\n  <header *ngIf=\"!isVideoSessionUrl()\">\n    <mat-toolbar color=\"primary\" class=\"mat-elevation-z6\">\n      <button mat-button routerLink=\"/\" id=\"navbar-logo\">\n        OpenVidu Classroom Demo\n      </button>\n      <span class=\"fill-remaining-space\"></span>\n      <div *ngIf=\"authenticationService.isLoggedIn()\" fxLayout=\"row\" fxShow=\"false\" fxShow.gt-sm>\n        <button mat-button routerLink=\"/lessons\">Lessons</button>\n        <button mat-button routerLink=\"/profile\">Profile</button>\n        <button mat-button (click)=\"authenticationService.directLogOut()\">LOGOUT</button>\n      </div>\n      <button *ngIf=\"authenticationService.isLoggedIn()\" mat-button fxHide=\"false\" fxHide.gt-sm (click)=\"sidenav.open()\">\n        <mat-icon>menu</mat-icon>\n      </button>\n    </mat-toolbar>\n  </header>\n\n  <main [@routerTransition]=\"o.isActivated && o.activatedRoute.routeConfig.path\">\n    <router-outlet #o=\"outlet\"></router-outlet>\n  </main>\n\n  <footer *ngIf=\"!isVideoSessionUrl()\" class=\"page-footer back-primary color-secondary mat-elevation-z5\">\n    <div class=\"container\">\n      <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"start start\" fxLayoutAlign.xs=\"start\">\n        <div fxFlex=\"50%\" fxFlex.xs=\"100%\">\n          <h2>This is a sample application</h2>\n          <p class=\"grey-text text-lighten-4\">Implementing a secure real time app with OpenVidu</p>\n        </div>\n        <div fxFlex=\"50%\" fxFlex.xs=\"100%\">\n          <div fxLayout=\"row\" fxLayoutAlign=\"end start\" fxLayoutAlign.xs=\"start\">\n            <div fxFlex=\"50%\">\n              <h2>Technologies</h2>\n              <ul>\n                <li>\n                  <a class=\"hover-link\" href=\"https://angular.io/\" target=\"_blank\">Angular</a>\n                </li>\n                <li>\n                  <a class=\"hover-link\" href=\"https://material.angular.io/\" target=\"_blank\">Angular Material</a>\n                </li>\n                <li>\n                  <a class=\"hover-link\" href=\"https://spring.io/\" target=\"_blank\">Spring Framework</a>\n                </li>\n                <li>\n                  <a class=\"hover-link\" href=\"https://www.kurento.org/\" target=\"_blank\">Kurento</a>\n                </li>\n              </ul>\n            </div>\n            <div fxFlex=\"50%\">\n              <h2>Connect</h2>\n              <ul>\n                <li>\n                  <a class=\"hover-link\" href=\"https://github.com/OpenVidu\" target=\"_blank\">GitHub repository</a>\n                </li>\n              </ul>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </footer>\n\n</mat-sidenav-container>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _router_animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./router.animation */ "./src/app/router.animation.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = /** @class */ (function () {
    function AppComponent(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    AppComponent.prototype.isVideoSessionUrl = function () {
        return (this.router.url.substring(0, '/lesson/'.length) === '/lesson/');
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")],
            animations: [_router_animation__WEBPACK_IMPORTED_MODULE_3__["routerTransition"]]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./material.module */ "./src/app/material.module.ts");
/* harmony import */ var _app_routing__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./app.routing */ "./src/app/app.routing.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./auth.guard */ "./src/app/auth.guard.ts");
/* harmony import */ var _components_presentation_presentation_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/presentation/presentation.component */ "./src/app/components/presentation/presentation.component.ts");
/* harmony import */ var _components_dashboard_dahsboard_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/dashboard/dahsboard.component */ "./src/app/components/dashboard/dahsboard.component.ts");
/* harmony import */ var _components_lesson_details_lesson_details_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/lesson-details/lesson-details.component */ "./src/app/components/lesson-details/lesson-details.component.ts");
/* harmony import */ var _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/profile/profile.component */ "./src/app/components/profile/profile.component.ts");
/* harmony import */ var _components_video_session_video_session_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/video-session/video-session.component */ "./src/app/components/video-session/video-session.component.ts");
/* harmony import */ var _components_error_message_error_message_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/error-message/error-message.component */ "./src/app/components/error-message/error-message.component.ts");
/* harmony import */ var _components_dashboard_join_session_dialog_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/dashboard/join-session-dialog.component */ "./src/app/components/dashboard/join-session-dialog.component.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./services/user.service */ "./src/app/services/user.service.ts");
/* harmony import */ var _services_lesson_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./services/lesson.service */ "./src/app/services/lesson.service.ts");
/* harmony import */ var _services_video_session_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./services/video-session.service */ "./src/app/services/video-session.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_9__["AppComponent"],
                _components_presentation_presentation_component__WEBPACK_IMPORTED_MODULE_11__["PresentationComponent"],
                _components_dashboard_dahsboard_component__WEBPACK_IMPORTED_MODULE_12__["DashboardComponent"],
                _components_lesson_details_lesson_details_component__WEBPACK_IMPORTED_MODULE_13__["LessonDetailsComponent"],
                _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_14__["ProfileComponent"],
                _components_video_session_video_session_component__WEBPACK_IMPORTED_MODULE_15__["VideoSessionComponent"],
                _components_error_message_error_message_component__WEBPACK_IMPORTED_MODULE_16__["ErrorMessageComponent"],
                _components_dashboard_join_session_dialog_component__WEBPACK_IMPORTED_MODULE_17__["JoinSessionDialogComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
                _angular_http__WEBPACK_IMPORTED_MODULE_2__["HttpModule"],
                _material_module__WEBPACK_IMPORTED_MODULE_7__["MaterialModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_5__["FlexLayoutModule"],
                _app_routing__WEBPACK_IMPORTED_MODULE_8__["routing"],
            ],
            providers: [
                _services_authentication_service__WEBPACK_IMPORTED_MODULE_18__["AuthenticationService"],
                _services_user_service__WEBPACK_IMPORTED_MODULE_19__["UserService"],
                _services_lesson_service__WEBPACK_IMPORTED_MODULE_20__["LessonService"],
                _services_video_session_service__WEBPACK_IMPORTED_MODULE_21__["VideoSessionService"],
                _auth_guard__WEBPACK_IMPORTED_MODULE_10__["AuthGuard"],
            ],
            entryComponents: [
                _components_dashboard_join_session_dialog_component__WEBPACK_IMPORTED_MODULE_17__["JoinSessionDialogComponent"],
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_9__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.routing.ts":
/*!********************************!*\
  !*** ./src/app/app.routing.ts ***!
  \********************************/
/*! exports provided: routing */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routing", function() { return routing; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _components_presentation_presentation_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/presentation/presentation.component */ "./src/app/components/presentation/presentation.component.ts");
/* harmony import */ var _components_dashboard_dahsboard_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/dashboard/dahsboard.component */ "./src/app/components/dashboard/dahsboard.component.ts");
/* harmony import */ var _components_lesson_details_lesson_details_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/lesson-details/lesson-details.component */ "./src/app/components/lesson-details/lesson-details.component.ts");
/* harmony import */ var _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/profile/profile.component */ "./src/app/components/profile/profile.component.ts");
/* harmony import */ var _components_video_session_video_session_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/video-session/video-session.component */ "./src/app/components/video-session/video-session.component.ts");
/* harmony import */ var _auth_guard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./auth.guard */ "./src/app/auth.guard.ts");







var appRoutes = [
    {
        path: '',
        component: _components_presentation_presentation_component__WEBPACK_IMPORTED_MODULE_1__["PresentationComponent"],
        pathMatch: 'full',
        data: { state: 'presentation' }
    },
    {
        path: 'lessons',
        component: _components_dashboard_dahsboard_component__WEBPACK_IMPORTED_MODULE_2__["DashboardComponent"],
        canActivate: [_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]],
        data: { state: 'lessons' }
    },
    {
        path: 'lesson-details/:id',
        component: _components_lesson_details_lesson_details_component__WEBPACK_IMPORTED_MODULE_3__["LessonDetailsComponent"],
        canActivate: [_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]],
        data: { state: 'lesson-details' }
    },
    {
        path: 'profile',
        component: _components_profile_profile_component__WEBPACK_IMPORTED_MODULE_4__["ProfileComponent"],
        canActivate: [_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]],
        data: { state: 'profile' }
    },
    {
        path: 'lesson/:id',
        component: _components_video_session_video_session_component__WEBPACK_IMPORTED_MODULE_5__["VideoSessionComponent"],
        canActivate: [_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]],
        data: { state: 'session' }
    },
];
var routing = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(appRoutes, { useHash: true });


/***/ }),

/***/ "./src/app/auth.guard.ts":
/*!*******************************!*\
  !*** ./src/app/auth.guard.ts ***!
  \*******************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/authentication.service */ "./src/app/services/authentication.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = /** @class */ (function () {
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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/components/dashboard/dahsboard.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/components/dashboard/dahsboard.component.ts ***!
  \*************************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _models_lesson__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/lesson */ "./src/app/models/lesson.ts");
/* harmony import */ var _services_lesson_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/lesson.service */ "./src/app/services/lesson.service.ts");
/* harmony import */ var _services_video_session_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/video-session.service */ "./src/app/services/video-session.service.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _join_session_dialog_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./join-session-dialog.component */ "./src/app/components/dashboard/join-session-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var DashboardComponent = /** @class */ (function () {
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
        dialogRef = this.dialog.open(_join_session_dialog_component__WEBPACK_IMPORTED_MODULE_7__["JoinSessionDialogComponent"]);
        dialogRef.componentInstance.myReference = dialogRef;
        dialogRef.afterClosed().subscribe(function (cameraOptions) {
            if (!!cameraOptions) {
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
        this.lessonService.newLesson(new _models_lesson__WEBPACK_IMPORTED_MODULE_3__["Lesson"](this.lessonTitle)).subscribe(function (lesson) {
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
        this.videoSessionService.createSession(lessonId).subscribe(function () {
            console.log('Session created');
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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/components/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/components/dashboard/dashboard.component.css")],
        }),
        __metadata("design:paramtypes", [_services_lesson_service__WEBPACK_IMPORTED_MODULE_4__["LessonService"],
            _services_video_session_service__WEBPACK_IMPORTED_MODULE_5__["VideoSessionService"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_6__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/components/dashboard/dashboard.component.css":
/*!**************************************************************!*\
  !*** ./src/app/components/dashboard/dashboard.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-card {\n  margin-top: 20px;\n}\n\nmat-card mat-icon {\n  text-align: center;\n}\n\nspan.teacher {\n  font-size: 12px;\n}\n"

/***/ }),

/***/ "./src/app/components/dashboard/dashboard.component.html":
/*!***************************************************************!*\
  !*** ./src/app/components/dashboard/dashboard.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!this.lessons\" class=\"cssload-container\">\n  <div class=\"cssload-tube-tunnel\"></div>\n</div>\n\n<div *ngIf=\"this.lessons\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div *ngIf=\"!addingLesson\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <div fxFlex=\"80%\">MY LESSONS</div>\n      <mat-icon fxFlex=\"20%\" fxLayoutAlign=\"end center\" *ngIf=\"authenticationService.isTeacher()\" (click)=\"addingLesson = true\"\n        [title]=\"'Add lesson'\">add_circle_outline</mat-icon>\n    </div>\n\n    <div *ngIf=\"addingLesson\">\n      <div>NEW LESSON</div>\n      <form #newLessonForm (ngSubmit)=\"newLesson(); newLessonForm.reset()\" [class.filtered]=\"sumbitNewLesson\">\n        <mat-form-field>\n          <input matInput placeholder=\"Title\" [(ngModel)]=\"lessonTitle\" name=\"lessonTitle\" id=\"lessonTitle\" type=\"text\" autocomplete=\"off\"\n            required>\n        </mat-form-field>\n        <div class=\"block-btn\">\n          <button mat-button type=\"submit\" [disabled]=\"sumbitNewLesson\">Send</button>\n          <button mat-button (click)=\"addingLesson = false; newLessonForm.reset()\" [disabled]=\"sumbitNewLesson\">Cancel</button>\n        </div>\n      </form>\n    </div>\n\n    <mat-card *ngFor=\"let lesson of lessons\">\n      <div fxLayout=\"row\" fxLayoutAlign=\"center center\" fxLayoutGap=\"10px\">\n        <span fxFlex=\"70%\" class=\"title\">{{lesson.title}}</span>\n        <span fxFlex=\"70%\" *ngIf=\"this.authenticationService.isStudent()\" class=\"teacher\">{{lesson.teacher.nickName}}</span>\n        <mat-icon fxFlex=\"15%\" *ngIf=\"this.authenticationService.isTeacher()\" (click)=\"goToLessonDetails(lesson)\" [title]=\"'Modify lesson'\">mode_edit</mat-icon>\n        <mat-icon fxFlex=\"15%\" (click)=\"goToLesson(lesson)\" [title]=\"'Go to lesson!'\">play_circle_filled</mat-icon>\n      </div>\n    </mat-card>\n\n    <div *ngIf=\"lessons.length === 0 && authenticationService.isStudent() && !addingLesson\">\n      <app-error-message [errorTitle]=\"'You do not have any lessons'\" [errorContent]=\"'Your teacher must invite you'\" [customClass]=\"'warning'\"\n        [closable]=\"false\"></app-error-message>\n    </div>\n\n    <div *ngIf=\"lessons.length === 0 && authenticationService.isTeacher() && !addingLesson\">\n      <app-error-message [errorTitle]=\"'You do not have any lessons'\" [errorContent]=\"'You can add one by clicking on the icon above'\"\n        [customClass]=\"'warning'\" [closable]=\"false\"></app-error-message>\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/dashboard/join-session-dialog.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/dashboard/join-session-dialog.component.ts ***!
  \***********************************************************************/
/*! exports provided: JoinSessionDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JoinSessionDialogComponent", function() { return JoinSessionDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var JoinSessionDialogComponent = /** @class */ (function () {
    function JoinSessionDialogComponent() {
        this.quality = 'medium';
        this.joinWithVideo = true;
        this.joinWithAudio = true;
    }
    JoinSessionDialogComponent.prototype.joinSession = function () {
        var cameraOptions = {
            audioSource: (!this.joinWithAudio) ? false : undefined,
            videoSource: (!this.joinWithVideo) ? false : undefined,
            resolution: this.getResolution()
        };
        this.myReference.close(cameraOptions);
    };
    JoinSessionDialogComponent.prototype.getResolution = function () {
        var resolution;
        switch (this.quality) {
            case 'low':
                resolution = '320x240';
                break;
            case 'medium':
                resolution = '640x480';
                break;
            case 'high':
                resolution = '1280x720';
                break;
            case 'veryhigh':
                resolution = '1920x1080';
                break;
            default:
                resolution = '640x480';
        }
        return resolution;
    };
    JoinSessionDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-join-session-dialog',
            template: "\n        <div>\n            <h1 mat-dialog-title>\n                Video options\n            </h1>\n            <form #dialogForm (ngSubmit)=\"joinSession()\">\n                <mat-dialog-content>\n                    <div id=\"quality-div\">\n                        <h5>Quality</h5>\n                        <mat-radio-group [(ngModel)]=\"quality\" name=\"quality\" id=\"quality\">\n                            <mat-radio-button value='low' title=\"320x240\">Low</mat-radio-button>\n                            <mat-radio-button value='medium' title=\"640x480\">Medium</mat-radio-button>\n                            <mat-radio-button value='high' title=\"1280x720\">High</mat-radio-button>\n                            <mat-radio-button value='veryhigh' title=\"1920x1080\">Very high</mat-radio-button>\n                        </mat-radio-group>\n                    </div>\n                    <div id=\"join-div\">\n                        <h5>Enter with active...</h5>\n                        <mat-checkbox [(ngModel)]=\"joinWithVideo\" name=\"joinWithVideo\" id=\"joinWithVideo\">Video</mat-checkbox>\n                        <mat-checkbox [(ngModel)]=\"joinWithAudio\" name=\"joinWithAudio\">Audio</mat-checkbox>\n                    </div>\n                </mat-dialog-content>\n                <mat-dialog-actions>\n                    <button mat-button mat-dialog-close type=\"button\">CANCEL</button>\n                    <button mat-button id=\"join-btn\" type=\"submit\">JOIN</button>\n                </mat-dialog-actions>\n            </form>\n        </div>\n    ",
            styles: ["\n        #quality-div {\n            margin-top: 20px;\n        }\n        #join-div {\n            margin-top: 25px;\n            margin-bottom: 20px;\n        }\n        #quality-tag {\n            display: block;\n        }\n        h5 {\n            margin-bottom: 10px;\n            text-align: left;\n        }\n        #joinWithVideo {\n            margin-right: 50px;\n        }\n        mat-dialog-actions {\n            display: block;\n        }\n        #join-btn {\n            float: right;\n        }\n    "],
        }),
        __metadata("design:paramtypes", [])
    ], JoinSessionDialogComponent);
    return JoinSessionDialogComponent;
}());



/***/ }),

/***/ "./src/app/components/error-message/error-message.component.css":
/*!**********************************************************************!*\
  !*** ./src/app/components/error-message/error-message.component.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".fail {\n  background-color: rgba(167, 56, 65, 0.2);\n  color: #a73841;\n}\n\n.warning {\n  background-color: rgba(175, 110, 0, 0.2);\n  color: #af6e00;\n}\n\n.correct {\n  background-color: rgba(55, 86, 70, 0.25);\n  color: #375546;\n}\n\nmat-icon {\n  cursor: pointer;\n  float: right;\n}\n\nmat-card {\n  max-width: 400px;\n  margin-top: 20px;\n  margin-bottom: 20px;\n  box-shadow: none;\n}\n"

/***/ }),

/***/ "./src/app/components/error-message/error-message.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/components/error-message/error-message.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card [ngClass]=\"customClass\">\n  <mat-icon *ngIf=\"closable\" (click)=\"closeAlert()\">clear</mat-icon>\n  <mat-card-title>{{this.errorTitle}}</mat-card-title>\n  <mat-card-subtitle [innerHTML]=\"this.errorContent\"></mat-card-subtitle>\n</mat-card>\n"

/***/ }),

/***/ "./src/app/components/error-message/error-message.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/components/error-message/error-message.component.ts ***!
  \*********************************************************************/
/*! exports provided: ErrorMessageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorMessageComponent", function() { return ErrorMessageComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ErrorMessageComponent = /** @class */ (function () {
    function ErrorMessageComponent() {
        this.eventShowable = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ErrorMessageComponent.prototype.closeAlert = function () {
        this.eventShowable.emit(false);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ErrorMessageComponent.prototype, "errorTitle", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ErrorMessageComponent.prototype, "errorContent", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], ErrorMessageComponent.prototype, "customClass", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], ErrorMessageComponent.prototype, "closable", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], ErrorMessageComponent.prototype, "timeable", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], ErrorMessageComponent.prototype, "eventShowable", void 0);
    ErrorMessageComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-error-message',
            template: __webpack_require__(/*! ./error-message.component.html */ "./src/app/components/error-message/error-message.component.html"),
            styles: [__webpack_require__(/*! ./error-message.component.css */ "./src/app/components/error-message/error-message.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ErrorMessageComponent);
    return ErrorMessageComponent;
}());



/***/ }),

/***/ "./src/app/components/lesson-details/lesson-details.component.css":
/*!************************************************************************!*\
  !*** ./src/app/components/lesson-details/lesson-details.component.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".attender-email {\n  font-size: 11px;\n}\n\n.no-margin-bottom {\n  margin-bottom: 0 !important;\n}\n\n.attender-row {\n  width: 100%;\n  margin-top: 20px;\n  min-height: 27px;\n}\n\n#new-attender-title {\n  margin-bottom: 5px;\n}\n\n/*Rotating animation*/\n\n@-webkit-keyframes rotating\n/* Safari and Chrome */\n\n{\n  from {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n}\n\n@keyframes rotating {\n  from {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n  to {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n}\n\n.rotating {\n  -webkit-animation: rotating 1s linear infinite;\n  animation: rotating 1s linear infinite;\n  cursor: default !important;\n}\n\n.rotating:hover {\n  color: inherit !important;\n}\n\n/*End rotating animation*/\n"

/***/ }),

/***/ "./src/app/components/lesson-details/lesson-details.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/components/lesson-details/lesson-details.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"lesson\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div *ngIf=\"!editingTitle\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <mat-icon fxFlex=\"15%\" fxLayoutAlign=\"start center\" (click)=\"router.navigate(['/lessons'])\" [title]=\"'Back to lessons'\">keyboard_arrow_left</mat-icon>\n      <h2 fxFlex=\"70%\">{{lesson.title}}</h2>\n      <mat-icon fxFlex=\"15%\" fxLayoutAlign=\"end center\" (click)=\"editingTitle = true; titleEdited = lesson.title\" [title]=\"'Edit lesson'\">mode_edit</mat-icon>\n    </div>\n\n    <div *ngIf=\"editingTitle\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n      <form #editLessonForm (ngSubmit)=\"editLesson(); editLessonForm.reset()\" [class.filtered]=\"sumbitEditLesson\">\n        <mat-form-field>\n          <input matInput placeholder=\"Title\" [(ngModel)]=\"titleEdited\" name=\"lessonTitle\" type=\"text\" autocomplete=\"off\" required>\n        </mat-form-field>\n        <div class=\"block-btn\">\n          <button mat-button type=\"submit\" [disabled]=\"sumbitEditLesson\">Send</button>\n          <button mat-button (click)=\"editingTitle = false; titleEdited = ''\" [disabled]=\"sumbitEditLesson\">Cancel</button>\n          <button mat-button (click)=\"deleteLesson()\" [disabled]=\"sumbitEditLesson\">Delete lesson</button>\n        </div>\n      </form>\n    </div>\n\n    <form #addAttendersForm (ngSubmit)=\"addLessonAttenders(); addAttendersForm.reset()\" [class.filtered]=\"sumbitAddAttenders\">\n      <h4 id=\"new-attender-title\">New attender</h4>\n      <mat-form-field>\n        <input matInput placeholder=\"Email\" [(ngModel)]=\"emailAttender\" name=\"attenderEmail\" type=\"text\" autocomplete=\"off\" required>\n      </mat-form-field>\n      <div class=\"block-btn\">\n        <button mat-button type=\"submit\" [disabled]=\"sumbitAddAttenders\">Send</button>\n        <button mat-button (click)=\"addAttendersForm.reset()\" [disabled]=\"sumbitAddAttenders || emailAttender == null\">Cancel</button>\n      </div>\n    </form>\n\n    <app-error-message *ngIf=\"addAttendersCorrect\" (eventShowable)=\"addAttendersCorrect = false\" [errorTitle]=\"attCorrectTitle\"\n      [errorContent]=\"attCorrectContent\" [customClass]=\"'correct'\" [closable]=\"true\"></app-error-message>\n    <app-error-message *ngIf=\"addAttendersError\" (eventShowable)=\"addAttendersError = false\" [errorTitle]=\"attErrorTitle\" [errorContent]=\"attErrorContent\"\n      [customClass]=\"'fail'\" [closable]=\"true\"></app-error-message>\n\n    <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutGap=\"20px\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\"\n      class=\"attender-row\">\n      <div fxFlex=\"90%\" class=\"no-margin-bottom\">\n        <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\">\n          <div class=\"no-margin-bottom\" fxFlex>{{authenticationService.getCurrentUser().nickName}}</div>\n          <div class=\"attender-email\" fxFlex>{{authenticationService.getCurrentUser().name}}</div>\n        </div>\n      </div>\n      <div fxFlex=\"10%\"></div>\n    </div>\n    <div *ngFor=\"let attender of lesson.attenders; let i = index\">\n      <div *ngIf=\"attender.id != authenticationService.getCurrentUser().id\" fxLayout=\"row\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\"\n        class=\"attender-row\">\n        <div fxFlex=\"90%\">\n          <div fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"space-between center\" fxLayoutAlign.xs=\"start\" fxLayoutGap=\"20px\">\n            <div class=\"no-margin-bottom\" fxFlex>{{attender.nickName}}</div>\n            <div class=\"attender-email\" fxFlex>{{attender.name}}</div>\n          </div>\n        </div>\n        <div fxFlex=\"10%\">\n          <mat-icon *ngIf=\"!this.arrayOfAttDels[i]\" (click)=\"deleteLessonAttender(i, attender)\" [title]=\"'Remove attender'\">clear</mat-icon>\n          <mat-icon *ngIf=\"this.arrayOfAttDels[i]\" class=\"rotating\">cached</mat-icon>\n        </div>\n      </div>\n    </div>\n    \n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/lesson-details/lesson-details.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/components/lesson-details/lesson-details.component.ts ***!
  \***********************************************************************/
/*! exports provided: LessonDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LessonDetailsComponent", function() { return LessonDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _models_lesson__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models/lesson */ "./src/app/models/lesson.ts");
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../models/user */ "./src/app/models/user.ts");
/* harmony import */ var _services_lesson_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/lesson.service */ "./src/app/services/lesson.service.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/authentication.service */ "./src/app/services/authentication.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LessonDetailsComponent = /** @class */ (function () {
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
            var l = new _models_lesson__WEBPACK_IMPORTED_MODULE_4__["Lesson"](this.titleEdited);
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
        var l = new _models_lesson__WEBPACK_IMPORTED_MODULE_4__["Lesson"](this.lesson.title);
        l.id = this.lesson.id;
        for (var j = 0; j < this.lesson.attenders.length; j++) {
            if (this.lesson.attenders[j].id !== attender.id) {
                // Inserting a new User object equal to the attender but "lessons" array empty
                l.attenders.push(new _models_user__WEBPACK_IMPORTED_MODULE_5__["User"](this.lesson.attenders[j]));
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
        this.attErrorContent = '';
        this.attCorrectContent = '';
        if (response.attendersAdded.length > 0) {
            for (var _i = 0, _a = response.attendersAdded; _i < _a.length; _i++) {
                var user = _a[_i];
                this.attCorrectContent += '<span class=\'feedback-list\'>' + user.name + '</span>';
            }
            isCorrect = true;
        }
        if (response.attendersAlreadyAdded.length > 0) {
            this.attErrorContent += '<span>The following users were already added to the lesson</span>';
            for (var _b = 0, _c = response.attendersAlreadyAdded; _b < _c.length; _b++) {
                var user = _c[_b];
                this.attErrorContent += '<span class=\'feedback-list\'>' + user.name + '</span>';
            }
            isError = true;
        }
        if (response.emailsValidNotRegistered.length > 0) {
            this.attErrorContent += '<span>The following users are not registered</span>';
            for (var _d = 0, _e = response.emailsValidNotRegistered; _d < _e.length; _d++) {
                var email = _e[_d];
                this.attErrorContent += '<span class=\'feedback-list\'>' + email + '</span>';
            }
            isError = true;
        }
        if (response.emailsInvalid) {
            if (response.emailsInvalid.length > 0) {
                this.attErrorContent += '<span>These are not valid emails</span>';
                for (var _f = 0, _g = response.emailsInvalid; _f < _g.length; _f++) {
                    var email = _g[_f];
                    this.attErrorContent += '<span class=\'feedback-list\'>' + email + '</span>';
                }
                isError = true;
            }
        }
        if (isError) {
            this.attErrorTitle = 'There have been some problems';
            this.addAttendersError = true;
        }
        else if (response.attendersAdded.length === 0) {
            this.attErrorTitle = 'No emails there!';
            this.addAttendersError = true;
        }
        if (isCorrect) {
            this.attCorrectTitle = 'The following users where properly added';
            this.addAttendersCorrect = true;
        }
    };
    LessonDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-lesson-details',
            template: __webpack_require__(/*! ./lesson-details.component.html */ "./src/app/components/lesson-details/lesson-details.component.html"),
            styles: [__webpack_require__(/*! ./lesson-details.component.css */ "./src/app/components/lesson-details/lesson-details.component.css")],
        }),
        __metadata("design:paramtypes", [_services_lesson_service__WEBPACK_IMPORTED_MODULE_6__["LessonService"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_7__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["Location"],
            _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"]])
    ], LessonDetailsComponent);
    return LessonDetailsComponent;
}());



/***/ }),

/***/ "./src/app/components/presentation/presentation.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/presentation/presentation.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "h1 {\n  text-align: center;\n  display: block;\n}\n\nmat-form-field {\n  width: 100%;\n}\n\nmat-card-actions {\n  padding-left: 10px;\n  padding-right: 10px;\n  color: #9e9e9e;\n}\n\n.btn-container {\n  text-align: center;\n  padding-top: 20px;\n}\n\n.card-button {\n  margin-left: 10px !important;\n}\n\n.radio-button-div {\n  text-align: center;\n  margin-bottom: 10px;\n}\n\n#sign-up-as {\n  color: #9e9e9e;\n  display: block;\n  margin-top: 15px;\n  margin-bottom: 10px;\n}\n\ntable {\n  margin: 0 auto;\n  margin-top: 30px;\n  text-align: left;\n}\n"

/***/ }),

/***/ "./src/app/components/presentation/presentation.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/presentation/presentation.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <h1>OpenVidu Classroom Demo</h1>\n\n    <div fxLayout=\"column\" fxLayoutAlign=\"space-around center\">\n\n      <mat-card>\n        <mat-card-content>\n\n          <div *ngIf=\"submitProcessing\" class=\"cssload-container\">\n            <div class=\"cssload-tube-tunnel\"></div>\n          </div>\n\n          <form #myForm (ngSubmit)=\"onSubmit()\" [class.filtered]=\"submitProcessing\">\n\n            <div>\n              <mat-form-field>\n                <input matInput placeholder=\"Email\" [(ngModel)]=\"email\" name=\"email\" id=\"email\" type=\"email\" required>\n              </mat-form-field>\n            </div>\n\n            <div *ngIf=\"!loginView\">\n              <mat-form-field>\n                <input matInput placeholder=\"Name\" [(ngModel)]=\"nickName\" name=\"nickName\" id=\"nickName\" type=\"text\" autocomplete=\"off\" required>\n              </mat-form-field>\n            </div>\n\n            <div>\n              <mat-form-field>\n                <input matInput placeholder=\"Password\" [(ngModel)]=\"password\" name=\"password\" id=\"password\" type=\"password\" required>\n              </mat-form-field>\n            </div>\n\n            <div *ngIf=\"!loginView\">\n              <mat-form-field>\n                <input matInput placeholder=\"Confirm password\" [(ngModel)]=\"confirmPassword\" name=\"confirmPassword\" id=\"confirmPassword\" type=\"password\"\n                  autocomplete=\"off\" required>\n              </mat-form-field>\n            </div>\n\n            <div *ngIf=\"!loginView\" class=\"radio-button-div\">\n              <span id=\"sign-up-as\">Sign up as...</span>\n              <mat-radio-group [(ngModel)]=\"roleUserSignup\" name=\"roleUserSignup\" id=\"roleUserSignup\">\n                <mat-radio-button value='student'>Student</mat-radio-button>\n                <mat-radio-button value='teacher'>Teacher</mat-radio-button>\n              </mat-radio-group>\n            </div>\n\n            <app-error-message *ngIf=\"fieldsIncorrect\" (eventShowable)=\"fieldsIncorrect = false\" [errorTitle]=\"errorTitle\" [errorContent]=\"errorContent\"\n              [customClass]=\"customClass\" [closable]=\"true\"></app-error-message>\n\n            <div class=\"btn-container\">\n              <button mat-raised-button color=\"accent\" type=\"submit\" *ngIf=\"loginView\" id=\"log-in-btn\">Log in</button>\n              <button mat-raised-button color=\"primary\" type=\"submit\" *ngIf=\"!loginView\" id=\"sign-up-btn\">Sign up</button>\n            </div>\n\n          </form>\n\n          <div *ngIf=\"loginView\">\n            <table>\n              <tr>\n                <th>Email</th>\n                <th>Password</th>\n              </tr>\n              <tr>\n                <td>teacher@gmail.com</td>\n                <td>pass</td>\n              </tr>\n              <tr>\n                <td>student1@gmail.com</td>\n                <td>pass</td>\n              </tr>\n              <tr>\n                <td>student2@gmail.com</td>\n                <td>pass</td>\n              </tr>\n            </table>\n          </div>\n\n        </mat-card-content>\n\n        <mat-card-actions>\n          <div *ngIf=\"loginView\">Not registered yet?<button mat-button (click)=\"setLoginView(false); myForm.reset()\" class=\"card-button\">Sign up</button></div>\n          <div *ngIf=\"!loginView\">Already registered?<button mat-button (click)=\"setLoginView(true); myForm.reset()\" class=\"card-button\">Log in</button></div>\n        </mat-card-actions>\n\n      </mat-card>\n\n    </div>\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/presentation/presentation.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/presentation/presentation.component.ts ***!
  \*******************************************************************/
/*! exports provided: PresentationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PresentationComponent", function() { return PresentationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/user.service */ "./src/app/services/user.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PresentationComponent = /** @class */ (function () {
    function PresentationComponent(authenticationService, userService, router) {
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.router = router;
        this.roleUserSignup = 'student';
        this.loginView = true;
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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-presentation',
            template: __webpack_require__(/*! ./presentation.component.html */ "./src/app/components/presentation/presentation.component.html"),
            styles: [__webpack_require__(/*! ./presentation.component.css */ "./src/app/components/presentation/presentation.component.css")]
        }),
        __metadata("design:paramtypes", [_services_authentication_service__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"],
            _services_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], PresentationComponent);
    return PresentationComponent;
}());



/***/ }),

/***/ "./src/app/components/profile/profile.component.css":
/*!**********************************************************!*\
  !*** ./src/app/components/profile/profile.component.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "table {\n  margin-top: 15px;\n  border-collapse: separate;\n  border-spacing: 15px 17px;\n}\n\nth {\n  text-align: left;\n}\n"

/***/ }),

/***/ "./src/app/components/profile/profile.component.html":
/*!***********************************************************!*\
  !*** ./src/app/components/profile/profile.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <div class=\"div-inner-main\" [style.xs]=\"{'width': '100%'}\">\n\n    <div>MY PROFILE</div>\n    <table>\n      <tr>\n        <td>Name</td>\n        <th>{{authenticationService.getCurrentUser().nickName}}</th>\n      </tr>\n      <tr>\n        <td>Email</td>\n        <th>{{authenticationService.getCurrentUser().name}}</th>\n      </tr>\n    </table>\n    \n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/profile/profile.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/components/profile/profile.component.ts ***!
  \*********************************************************/
/*! exports provided: ProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProfileComponent", function() { return ProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/authentication.service */ "./src/app/services/authentication.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(authenticationService) {
        this.authenticationService = authenticationService;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.user = this.authenticationService.getCurrentUser();
    };
    ProfileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-profile',
            template: __webpack_require__(/*! ./profile.component.html */ "./src/app/components/profile/profile.component.html"),
            styles: [__webpack_require__(/*! ./profile.component.css */ "./src/app/components/profile/profile.component.css")]
        }),
        __metadata("design:paramtypes", [_services_authentication_service__WEBPACK_IMPORTED_MODULE_1__["AuthenticationService"]])
    ], ProfileComponent);
    return ProfileComponent;
}());



/***/ }),

/***/ "./src/app/components/video-session/video-session.component.css":
/*!**********************************************************************!*\
  !*** ./src/app/components/video-session/video-session.component.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "h1 {\n  text-align: center;\n  margin: 0;\n  color: white;\n}\n\n#header-div {\n  position: absolute;\n  z-index: 1000;\n  width: 100%;\n  background: rgba(0, 0, 0, 0.4);\n  -webkit-touch-callout: none; /* iOS Safari */\n  -webkit-user-select: none; /* Safari */ /* Konqueror HTML */\n     -moz-user-select: none; /* Firefox */\n      -ms-user-select: none; /* Internet Explorer/Edge */\n          user-select: none;\n}\n\nmat-icon {\n  font-size: 38px;\n  width: 38px;\n  height: 38px;\n  color: white;\n  transition: color .2s linear;\n}\n\nmat-icon:hover {\n  color: #ffd740;\n}\n\n#back-btn {\n  float: left;\n}\n\n.right-btn {\n  float: right;\n}\n"

/***/ }),

/***/ "./src/app/components/video-session/video-session.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/components/video-session/video-session.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"header-div\">\n    <mat-icon id=\"back-btn\" (click)=\"location.back()\" [title]=\"'Back to lessons'\">keyboard_arrow_left</mat-icon>\n    <mat-icon class=\"right-btn\" (click)=\"toggleFullScreen()\" [title]=\"'Fullscreen'\">{{fullscreenIcon}}</mat-icon>\n    <mat-icon class=\"right-btn\" (click)=\"toggleLocalVideo()\" [title]=\"'Toggle video'\">{{videoIcon}}</mat-icon>\n    <mat-icon class=\"right-btn\" (click)=\"toggleLocalAudio()\" [title]=\"'Toggle audio'\">{{audioIcon}}</mat-icon>\n    <h1>{{lesson?.title}}</h1>\n</div>\n<div id=\"publisher\"></div>\n<div id=\"subscriber\"></div>"

/***/ }),

/***/ "./src/app/components/video-session/video-session.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/components/video-session/video-session.component.ts ***!
  \*********************************************************************/
/*! exports provided: VideoSessionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoSessionComponent", function() { return VideoSessionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var openvidu_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! openvidu-browser */ "./node_modules/openvidu-browser/lib/index.js");
/* harmony import */ var openvidu_browser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(openvidu_browser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_video_session_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/video-session.service */ "./src/app/services/video-session.service.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/authentication.service */ "./src/app/services/authentication.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var VideoSessionComponent = /** @class */ (function () {
    function VideoSessionComponent(location, authenticationService, videoSessionService) {
        this.location = location;
        this.authenticationService = authenticationService;
        this.videoSessionService = videoSessionService;
    }
    VideoSessionComponent.prototype.OPEN_VIDU_CONNECTION = function () {
        // 0) Obtain 'token' from server
        // In this case, the method ngOnInit takes care of it
        var _this = this;
        // 1) Initialize OpenVidu and your Session
        this.OV = new openvidu_browser__WEBPACK_IMPORTED_MODULE_2__["OpenVidu"]();
        this.session = this.OV.initSession();
        // 2) Specify the actions when events take place
        this.session.on('streamCreated', function (event) {
            console.warn('STREAM CREATED!');
            console.warn(event.stream);
            _this.session.subscribe(event.stream, 'subscriber', {
                insertMode: 'APPEND'
            });
        });
        this.session.on('streamDestroyed', function (event) {
            console.warn('STREAM DESTROYED!');
            console.warn(event.stream);
        });
        this.session.on('connectionCreated', function (event) {
            if (event.connection.connectionId === _this.session.connection.connectionId) {
                console.warn('YOUR OWN CONNECTION CREATED!');
            }
            else {
                console.warn('OTHER USER\'S CONNECTION CREATED!');
            }
            console.warn(event.connection);
        });
        this.session.on('connectionDestroyed', function (event) {
            console.warn('OTHER USER\'S CONNECTION DESTROYED!');
            console.warn(event.connection);
        });
        // 3) Connect to the session
        this.session.connect(this.token, 'CLIENT:' + this.authenticationService.getCurrentUser().name)
            .then(function () {
            if (_this.authenticationService.isTeacher()) {
                // 4) Get your own camera stream with the desired resolution and publish it, only if the user is supposed to do so
                _this.publisher = _this.OV.initPublisher('publisher', _this.cameraOptions);
                _this.publisher.on('accessAllowed', function () {
                    console.warn('CAMERA ACCESS ALLOWED!');
                });
                _this.publisher.on('accessDenied', function () {
                    console.warn('CAMERA ACCESS DENIED!');
                });
                _this.publisher.on('streamCreated', function (event) {
                    console.warn('STREAM CREATED BY PUBLISHER!');
                    console.warn(event.stream);
                });
                // 5) Publish your stream
                _this.session.publish(_this.publisher);
            }
        }).catch(function (error) {
            console.log('There was an error connecting to the session:', error.code, error.message);
        });
    };
    VideoSessionComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Specific aspects of this concrete application
        this.previousConnectionStuff();
        if (this.authenticationService.isTeacher()) {
            // If the user is the teacher: creates the session and gets a token (with PUBLISHER role)
            this.videoSessionService.createSession(this.lesson.id).subscribe(function () {
                _this.videoSessionService.generateToken(_this.lesson.id).subscribe(function (response) {
                    _this.token = response[0];
                    console.warn('Token: ' + _this.token);
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
            this.videoSessionService.generateToken(this.lesson.id).subscribe(function (response) {
                _this.token = response[0];
                console.warn('Token: ' + _this.token);
                _this.OPEN_VIDU_CONNECTION();
            }, function (error) {
                console.log(error);
            });
        }
        // Specific aspects of this concrete application
        this.afterConnectionStuff();
    };
    VideoSessionComponent.prototype.ngAfterViewInit = function () {
        this.toggleScrollPage('hidden');
    };
    VideoSessionComponent.prototype.ngOnDestroy = function () {
        this.videoSessionService.removeUser(this.lesson.id).subscribe(function (response) {
            console.warn('You have succesfully left the lesson');
        }, function (error) {
            console.log(error);
        });
        this.toggleScrollPage('auto');
        this.exitFullScreen();
        if (this.OV) {
            this.session.disconnect();
        }
    };
    VideoSessionComponent.prototype.toggleScrollPage = function (scroll) {
        var content = document.getElementsByClassName('mat-sidenav-content')[0];
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
            console.log('enter FULLSCREEN!');
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
            console.log('exit FULLSCREEN!');
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
        this.localVideoActivated = this.cameraOptions.videoSource !== false;
        this.localAudioActivated = this.cameraOptions.audioSource !== false;
        this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
        this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
        this.fullscreenIcon = 'fullscreen';
    };
    VideoSessionComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-video-session',
            template: __webpack_require__(/*! ./video-session.component.html */ "./src/app/components/video-session/video-session.component.html"),
            styles: [__webpack_require__(/*! ./video-session.component.css */ "./src/app/components/video-session/video-session.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"],
            _services_video_session_service__WEBPACK_IMPORTED_MODULE_3__["VideoSessionService"]])
    ], VideoSessionComponent);
    return VideoSessionComponent;
}());



/***/ }),

/***/ "./src/app/material.module.ts":
/*!************************************!*\
  !*** ./src/app/material.module.ts ***!
  \************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatRadioModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatCheckboxModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBarModule"]
            ],
            exports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSidenavModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatRadioModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatCheckboxModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBarModule"]
            ]
        })
    ], MaterialModule);
    return MaterialModule;
}());



/***/ }),

/***/ "./src/app/models/lesson.ts":
/*!**********************************!*\
  !*** ./src/app/models/lesson.ts ***!
  \**********************************/
/*! exports provided: Lesson */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lesson", function() { return Lesson; });
var Lesson = /** @class */ (function () {
    function Lesson(title) {
        this.title = title;
        this.attenders = [];
    }
    return Lesson;
}());



/***/ }),

/***/ "./src/app/models/user.ts":
/*!********************************!*\
  !*** ./src/app/models/user.ts ***!
  \********************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
var User = /** @class */ (function () {
    function User(u) {
        this.id = u.id;
        this.name = u.name;
        this.nickName = u.nickName;
        this.roles = u.roles;
        this.lessons = [];
    }
    return User;
}());



/***/ }),

/***/ "./src/app/router.animation.ts":
/*!*************************************!*\
  !*** ./src/app/router.animation.ts ***!
  \*************************************/
/*! exports provided: routerTransition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routerTransition", function() { return routerTransition; });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");

var routerTransition = Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["trigger"])('routerTransition', [
    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["transition"])('* <=> *', [
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':enter, :leave', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ position: 'fixed', width: '100%' }), { optional: true }),
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["group"])([
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':enter', [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: '0' }),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('0.4s ease-in-out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: '1' }))
            ], { optional: true }),
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(':leave', [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: '1' }),
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('0.2s cubic-bezier(0.000, 0.900, 0.495, 0.990)', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ opacity: '0' }))
            ], { optional: true }),
        ])
    ])
]);


/***/ }),

/***/ "./src/app/services/authentication.service.ts":
/*!****************************************************!*\
  !*** ./src/app/services/authentication.service.ts ***!
  \****************************************************/
/*! exports provided: AuthenticationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return AuthenticationService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthenticationService = /** @class */ (function () {
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
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({
            'Authorization': 'Basic ' + userPass,
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.get(this.urlLogIn, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) {
            _this.processLogInResponse(response);
            return _this.user;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].throw(error); }));
    };
    AuthenticationService.prototype.logOut = function () {
        var _this = this;
        console.log('Logging out...');
        return this.http.get(this.urlLogOut)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) {
            console.log('Logout succesful!');
            _this.user = null;
            _this.role = null;
            // clear token remove user from local storage to log user out and navigates to welcome page
            _this.token = null;
            localStorage.removeItem('login');
            localStorage.removeItem('rol');
            _this.router.navigate(['']);
            return response;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].throw(error); }));
    };
    AuthenticationService.prototype.directLogOut = function () {
        this.logOut().subscribe(function (response) { }, function (error) { return console.log('Error when trying to log out: ' + error); });
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
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        this.http.get(this.urlLogIn, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return _this.processLogInResponse(response); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) {
            if (error.status !== 401) {
                console.error('Error when asking if logged: ' + JSON.stringify(error));
                _this.logOut();
                return rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"].throw(error);
            }
        }));
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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_3__["Http"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]])
    ], AuthenticationService);
    return AuthenticationService;
}());

function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}


/***/ }),

/***/ "./src/app/services/lesson.service.ts":
/*!********************************************!*\
  !*** ./src/app/services/lesson.service.ts ***!
  \********************************************/
/*! exports provided: LessonService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LessonService", function() { return LessonService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _authentication_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var rxjs_Rx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/Rx */ "./node_modules/rxjs-compat/_esm5/Rx.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LessonService = /** @class */ (function () {
    function LessonService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.url = 'api-lessons';
    }
    LessonService.prototype.getLessons = function (user) {
        var _this = this;
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.get(this.url + '/user/' + user.id, options) // Must send userId
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    LessonService.prototype.getLesson = function (lessonId) {
        var _this = this;
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.get(this.url + '/lesson/' + lessonId, options) // Must send userId
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    // POST new lesson. On success returns the created lesson
    LessonService.prototype.newLesson = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.post(this.url + '/new', body, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    // PUT existing lesson. On success returns the updated lesson
    LessonService.prototype.editLesson = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.put(this.url + '/edit', body, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    // DELETE existing lesson. On success returns the deleted lesson (simplified version)
    LessonService.prototype.deleteLesson = function (lessonId) {
        var _this = this;
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.delete(this.url + '/delete/' + lessonId, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    // PUT existing lesson, modifying its attenders (adding them). On success returns the updated lesson.attenders array
    LessonService.prototype.addLessonAttenders = function (lessonId, userEmails) {
        var _this = this;
        var body = JSON.stringify(userEmails);
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.put(this.url + '/edit/add-attenders/lesson/' + lessonId, body, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    // PUT existing lesson, modifying its attenders (deleting them). On success returns the updated lesson.attenders array
    LessonService.prototype.deleteLessonAttenders = function (lesson) {
        var _this = this;
        var body = JSON.stringify(lesson);
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.put(this.url + '/edit/delete-attenders', body, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    LessonService.prototype.obtainLocalLesson = function (id) {
        return this.authenticationService.getCurrentUser().lessons.find(function (lesson) { return lesson.id === id; });
    };
    LessonService.prototype.handleError = function (error) {
        console.error(error);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])('Server error (' + error.status + '): ' + error.text());
    };
    LessonService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_3__["Http"], _authentication_service__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"]])
    ], LessonService);
    return LessonService;
}());



/***/ }),

/***/ "./src/app/services/user.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/user.service.ts ***!
  \******************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
        this.url = 'api-users';
    }
    UserService.prototype.newUser = function (name, pass, nickName, role) {
        var _this = this;
        var body = JSON.stringify([name, pass, nickName, role]);
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.post(this.url + '/new', body, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    UserService.prototype.handleError = function (error) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])(error.status);
    };
    UserService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_3__["Http"]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./src/app/services/video-session.service.ts":
/*!***************************************************!*\
  !*** ./src/app/services/video-session.service.ts ***!
  \***************************************************/
/*! exports provided: VideoSessionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VideoSessionService", function() { return VideoSessionService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _authentication_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./authentication.service */ "./src/app/services/authentication.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var VideoSessionService = /** @class */ (function () {
    function VideoSessionService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.url = 'api-sessions';
    }
    // Returns nothing (HttpResponse)
    VideoSessionService.prototype.createSession = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        return this.http.post(this.url + '/create-session', body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    // Returns {0: sessionId, 1: token}
    VideoSessionService.prototype.generateToken = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json' });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.post(this.url + '/generate-token', body, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    VideoSessionService.prototype.removeUser = function (lessonId) {
        var _this = this;
        var body = JSON.stringify(lessonId);
        var headers = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["Headers"]({ 'Content-Type': 'application/json' });
        var options = new _angular_http__WEBPACK_IMPORTED_MODULE_3__["RequestOptions"]({ headers: headers });
        return this.http.post(this.url + '/remove-user', body, options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (response) { return response; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["catchError"])(function (error) { return _this.handleError(error); }));
    };
    VideoSessionService.prototype.handleError = function (error) {
        console.error(error);
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["throwError"])('Server error (' + error.status + '): ' + error.text());
    };
    VideoSessionService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_3__["Http"], _authentication_service__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"]])
    ], VideoSessionService);
    return VideoSessionService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    URL_BACK: 'https://localhost:5000'
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"]);


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /opt/src/angular/frontend/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map