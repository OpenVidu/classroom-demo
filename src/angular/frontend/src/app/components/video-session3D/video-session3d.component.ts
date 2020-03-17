import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ConnectionEvent, OpenVidu, Publisher, PublisherProperties, Session, StreamEvent } from 'openvidu-browser';
import { Lesson } from '../../models/lesson';
import { AuthenticationService } from '../../services/authentication.service';
import { VideoSessionService } from '../../services/video-session.service';

var ovr = require('openvidu-vr-library').OVVR;

@Component({
    selector: 'app-video-session-3d',
    templateUrl: './video-session3d.component.html',
    styleUrls: ['./video-session3d.component.css']
})
export class VideoSession3DComponent implements OnInit, OnDestroy, AfterViewInit {


    SUBSCRIBER = 'SUBSCRIBER';
    PUBLISHER = 'PUBLISHER';

    lesson: Lesson;

    OV: OpenVidu;
    session: Session;
    publisher: Publisher;
    OVVr;

    token: string;

    cameraOptions: PublisherProperties;

    localVideoActivated: boolean;
    localAudioActivated: boolean;
    screenActive: boolean;
    videoIcon: string;
    audioIcon: string;
    screenIcon: string;
    fullscreenIcon: string;

    constructor(
        public location: Location,
        public authenticationService: AuthenticationService,
        private videoSessionService: VideoSessionService,
        private snackBar: MatSnackBar) {
            this.OVVr = new ovr();
        }


    OPEN_VIDU_CONNECTION() {

        // 0) Obtain 'token' from server
        // In this case, the method ngOnInit takes care of it


        // 1) Initialize OpenVidu and your Session
        this.OV = new OpenVidu();
        this.session = this.OV.initSession();

        // 2) Specify the actions when events take place
        this.session.on('streamCreated', (event: StreamEvent) => {
            console.warn('STREAM CREATED!');
            console.warn(event.stream);
            this.session.subscribe(event.stream, 'subscriber', {
                insertMode: 'APPEND'
            });
            setTimeout(() => {
                console.log("cREATING TEACHER BOX");
                const video: any = document.getElementById('video');
                video.srcObject = (<any>event.stream).mediaStream;
                this.OVVr.createTeacherBox();
            }, 2000);
        });

        this.session.on('streamDestroyed', (event: StreamEvent) => {
            console.warn('STREAM DESTROYED!');
            console.warn(event.stream);
        });

        this.session.on('connectionCreated', (event: ConnectionEvent) => {
            if (event.connection.connectionId === this.session.connection.connectionId) {
                console.warn('YOUR OWN CONNECTION CREATED!');
            } else {
                console.warn('OTHER USER\'S CONNECTION CREATED!', event);
                console.warn('is teacher!', this.authenticationService.connectionBelongsToTeacher(event.connection));

                if (!this.authenticationService.connectionBelongsToTeacher(event.connection)) {
                    console.warn('creating student box!');

                    this.OVVr.createStudentBox();
                }
            }
            console.warn(event.connection);
        });

        this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
            console.warn('OTHER USER\'S CONNECTION DESTROYED!');
            console.warn(event.connection);
            if (this.authenticationService.connectionBelongsToTeacher(event.connection)) {
                this.OVVr.removeTeacherBox();
                this.location.back();
                return;
            }
            this.OVVr.removeStudentBox();

        });


        // 3) Connect to the session
        this.session.connect(this.token, 'CLIENT:' + this.authenticationService.getCurrentUser().name)
            .then(() => {
                if (this.authenticationService.isTeacher()) {

                    // 4) Get your own camera stream with the desired resolution and publish it, only if the user is supposed to do so
                    this.publisher = this.OV.initPublisher('video', this.cameraOptions);
                    console.warn("INIT THREEJS teacher");
                    this.OVVr.init(this.PUBLISHER);
                    this.OVVr.animate();

                    this.publisher.on('streamCreated', (event: StreamEvent) => {
                        console.warn('STREAM CREATED BY PUBLISHER!');
                        console.warn(event.stream);
                        setTimeout(() => {
                            console.warn("CREATE TEACHER BOX STREAM CREATED TEACHER");
                            const video: any = document.getElementById('video');
                            video.srcObject = (<any>event.stream).mediaStream;
                            this.OVVr.createTeacherBox();
                        }, 2000);
                    })

                    // 5) Publish your stream
                    this.session.publish(this.publisher);
                }

            }).catch(error => {
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    }

    switchVideo() {
        let videosource = undefined;

        if (!this.screenActive) {
            videosource = 'screen';
        }
        this.screenActive = !this.screenActive;
        this.screenIcon = this.screenActive ? 'stop_screen_share' : 'screen_share' ;


        this.OV.getUserMedia({
            audioSource: undefined,
            videoSource: videosource,
        }).then(mediaStream => {
            const newTrack = mediaStream.getVideoTracks()[0];
            this.publisher.replaceTrack(newTrack);
        });
    }


    ngOnInit() {

        // Specific aspects of this concrete application
        this.previousConnectionStuff();

        if (this.authenticationService.isTeacher()) {

            // If the user is the teacher: creates the session and gets a token (with PUBLISHER role)
            this.videoSessionService.createSession(this.lesson.id).subscribe(
                () => {
                    this.videoSessionService.generateToken(this.lesson.id).subscribe(
                        response => {
                            this.token = response[0];
                            console.warn('Token: ' + this.token);
                            this.OPEN_VIDU_CONNECTION();
                        },
                        error => {
                            console.log(error);
                        });
                },
                error => {
                    console.log(error);
                }
            );
        } else {

            // If the user is a student: gets a token (with SUBSCRIBER role)
            this.videoSessionService.generateToken(this.lesson.id).subscribe(
                response => { // {0: token}
                    this.token = response[0];
                    console.warn('Token: ' + this.token);
                    console.warn("INIT THREEJS student2");
                    this.OVVr.init(this.SUBSCRIBER);
                    this.OVVr.animate();
                    this.OPEN_VIDU_CONNECTION();
                },
                error => {
                    console.log(error);
                    if (error.status === 409) {
                        this.snackBar.open('The teacher has not opened the lesson yet!', 'Undo', {
                            duration: 3000
                        });
                        this.location.back();
                    }
                });
        }


        // Specific aspects of this concrete application
        this.afterConnectionStuff();
    }

    ngAfterViewInit() {
        this.toggleScrollPage('hidden');
    }

    ngOnDestroy() {
        this.videoSessionService.removeUser(this.lesson.id).subscribe(
            response => {
                console.warn('You have succesfully left the lesson');
            },
            error => {
                console.log(error);
            });
        this.toggleScrollPage('auto');
        this.exitFullScreen();
        if (this.OV) { this.session.disconnect(); }
    }

    toggleScrollPage(scroll: string) {
        const content = <HTMLElement>document.getElementsByClassName('mat-sidenav-content')[0];
        content.style.overflow = scroll;
    }

    toggleLocalVideo() {
        this.localVideoActivated = !this.localVideoActivated;
        this.publisher.publishVideo(this.localVideoActivated);
        this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
    }

    toggleLocalAudio() {
        this.localAudioActivated = !this.localAudioActivated;
        this.publisher.publishAudio(this.localAudioActivated);
        this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
    }

    toggleFullScreen() {
        const document: any = window.document;
        const fs = document.getElementsByTagName('html')[0];
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {
            console.log('enter FULLSCREEN!');
            this.fullscreenIcon = 'fullscreen_exit';
            if (fs.requestFullscreen) {
                fs.requestFullscreen();
            } else if (fs.msRequestFullscreen) {
                fs.msRequestFullscreen();
            } else if (fs.mozRequestFullScreen) {
                fs.mozRequestFullScreen();
            } else if (fs.webkitRequestFullscreen) {
                fs.webkitRequestFullscreen();
            }
        } else {
            console.log('exit FULLSCREEN!');
            this.fullscreenIcon = 'fullscreen';
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    exitFullScreen() {
        const document: any = window.document;
        const fs = document.getElementsByTagName('html')[0];
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    previousConnectionStuff() {
        this.lesson = this.videoSessionService.lesson;
        this.cameraOptions = this.videoSessionService.cameraOptions;
    }

    afterConnectionStuff() {
        if (this.authenticationService.isTeacher()) {
            this.localVideoActivated = this.cameraOptions.publishVideo !== false;
            this.localAudioActivated = this.cameraOptions.publishAudio !== false;

            this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
            this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
            this.screenIcon = this.screenActive ? 'stop_screen_share' : 'screen_share' ;
        }
        this.fullscreenIcon = 'fullscreen';
    }

}
