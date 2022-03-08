import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PublisherProperties } from 'openvidu-browser';

@Component({
    selector: 'app-join-session-dialog',
    template: `
        <div>
            <h1 mat-dialog-title>
                Video options
            </h1>
            <form #dialogForm (ngSubmit)="joinSession()">
                <mat-dialog-content>
                    <div id="quality-div">
                        <h5>Quality</h5>
                        <mat-radio-group [(ngModel)]="quality" name="quality" id="quality">
                            <mat-radio-button value='low' title="320x240">Low</mat-radio-button>
                            <mat-radio-button value='medium' title="640x480">Medium</mat-radio-button>
                            <mat-radio-button value='high' title="1280x720">High</mat-radio-button>
                            <mat-radio-button value='veryhigh' title="1920x1080">Very high</mat-radio-button>
                        </mat-radio-group>
                    </div>
                    <div id="join-div">
                        <h5>Enter with active...</h5>
                        <mat-checkbox [(ngModel)]="joinWithVideo" name="joinWithVideo" id="joinWithVideo">Video</mat-checkbox>
                        <mat-checkbox [(ngModel)]="joinWithAudio" name="joinWithAudio">Audio</mat-checkbox>
                    </div>
                </mat-dialog-content>
                <mat-dialog-actions>
                    <button mat-button mat-dialog-close type="button">CANCEL</button>
                    <button mat-button id="join-btn" type="submit">JOIN</button>
                </mat-dialog-actions>
            </form>
        </div>
    `,
    styles: [`
        #quality-div {
            margin-top: 20px;
        }
        #join-div {
            margin-top: 25px;
            margin-bottom: 20px;
        }
        #quality-tag {
            display: block;
        }
        h5 {
            margin-bottom: 10px;
            text-align: left;
        }
        #joinWithVideo {
            margin-right: 50px;
        }
        mat-dialog-actions {
            display: block;
        }
        #join-btn {
            float: right;
        }
    `],
})
export class JoinSessionDialogComponent {

    public myReference: MatDialogRef<JoinSessionDialogComponent>;
    quality = 'medium';
    joinWithVideo = true;
    joinWithAudio = true;

    constructor() { }

    joinSession() {
        const cameraOptions: PublisherProperties = {
            publishAudio: (!this.joinWithAudio) ? false : true,
            publishVideo: (!this.joinWithVideo) ? false : true,
            resolution: this.getResolution()
        };
        this.myReference.close(cameraOptions);
    }

    getResolution(): string {
        let resolution;
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
    }
}
