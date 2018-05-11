import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresentationComponent } from './components/presentation/presentation.component';
import { DashboardComponent } from './components/dashboard/dahsboard.component';
import { LessonDetailsComponent } from './components/lesson-details/lesson-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VideoSessionComponent } from './components/video-session/video-session.component';

import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: PresentationComponent,
    pathMatch: 'full',
    data: { state: 'presentation' }
  },
  {
    path: 'lessons',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { state: 'lessons' }
  },
  {
    path: 'lesson-details/:id',
    component: LessonDetailsComponent,
    canActivate: [AuthGuard],
    data: { state: 'lesson-details' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { state: 'profile' }
  },
  {
    path: 'lesson/:id',
    component: VideoSessionComponent,
    canActivate: [AuthGuard],
    data: { state: 'session' }
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
