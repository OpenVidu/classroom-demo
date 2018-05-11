import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './services/authentication.service';
import { routerTransition } from './router.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition]
})
export class AppComponent {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  isVideoSessionUrl() {
    return (this.router.url.substring(0, '/lesson/'.length) === '/lesson/');
  }

}
