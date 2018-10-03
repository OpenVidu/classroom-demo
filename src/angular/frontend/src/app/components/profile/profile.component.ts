import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    private user: User;

    constructor(public authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.user = this.authenticationService.getCurrentUser();
    }

}
