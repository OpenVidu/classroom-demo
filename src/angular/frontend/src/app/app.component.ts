import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from './router.animation';
import { AuthenticationService } from './services/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition]
})
export class AppComponent {

  constructor(public router: Router, public authenticationService: AuthenticationService) {

  }

  isVideoSessionUrl() {
    return (this.router.url.substring(0, '/lesson/'.length) === '/lesson/');
  }

}
