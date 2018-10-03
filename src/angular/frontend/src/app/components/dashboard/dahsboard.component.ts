import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { PublisherProperties } from 'openvidu-browser';
import { Lesson } from '../../models/lesson';
import { AuthenticationService } from '../../services/authentication.service';
import { LessonService } from '../../services/lesson.service';
import { VideoSessionService } from '../../services/video-session.service';
import { JoinSessionDialogComponent } from './join-session-dialog.component';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

    lessons: Lesson[];

    addingLesson: false;
    lessonTitle: string;
    submitNewLesson: boolean;

    constructor(
        private lessonService: LessonService,
        private videoSessionService: VideoSessionService,
        private router: Router,
        public authenticationService: AuthenticationService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.authenticationService.checkCredentials();
        this.getLessons();
    }

    logout() {
        this.authenticationService.logOut();
    }

    getLessons(): void {
        this.lessonService.getLessons(this.authenticationService.getCurrentUser()).subscribe(
            lessons => {
                console.log('User\'s lessons: ');
                console.log(lessons);
                this.lessons = lessons;
                this.authenticationService.updateUserLessons(this.lessons);
            },
            error => console.log(error));
    }

    goToLesson(lesson: Lesson) {
        this.videoSessionService.lesson = lesson;
        if (this.authenticationService.isTeacher()) {
            let dialogRef: MatDialogRef<JoinSessionDialogComponent>;
            dialogRef = this.dialog.open(JoinSessionDialogComponent);
            dialogRef.componentInstance.myReference = dialogRef;

            dialogRef.afterClosed().subscribe((cameraOptions: PublisherProperties) => {
                if (!!cameraOptions) {
                    console.log('Joining session with options:');
                    console.log(cameraOptions);
                    this.videoSessionService.cameraOptions = cameraOptions;
                    this.router.navigate(['/lesson/' + lesson.id]);
                }
            });
        } else {
            this.router.navigate(['/lesson/' + lesson.id]);
        }
    }

    goToLessonDetails(lesson: Lesson) {
        this.router.navigate(['/lesson-details/' + lesson.id]);
    }

    newLesson() {
        this.submitNewLesson = true;
        this.lessonService.newLesson(new Lesson(this.lessonTitle)).subscribe(
            lesson => {
                console.log('New lesson added: ');
                console.log(lesson);
                this.lessons.push(lesson);
                this.authenticationService.updateUserLessons(this.lessons);
                this.submitNewLesson = false;
                this.snackBar.open('Lesson added!', undefined, { duration: 3000 });
                this.addingLesson = false;
            },
            error => {
                console.log(error);
                this.submitNewLesson = false;
                this.snackBar.open('There has been a problem...', undefined, { duration: 3000 });
            }
        );
    }

}
