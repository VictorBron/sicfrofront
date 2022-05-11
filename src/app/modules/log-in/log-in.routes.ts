import { Routes } from '@angular/router';
import { LoginGuard } from '../../shared/guards';
import { LogInComponent } from './containers';
import { APP_URLS } from '../../shared/constants';

export const routes: Routes = [
  {
    path: APP_URLS.LOGIN.shortPath,
    component: LogInComponent,
    canActivate: [LoginGuard],
  },
];
