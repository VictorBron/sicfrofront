import { Routes } from '@angular/router';
import { APP_URLS } from '../../shared/constants';
import { AuthGuard } from '../../shared/guards';
import { UserCreateComponent, UsersListComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.USER_CREATE.shortPath,
    component: UserCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.USER_DETAIL.shortPath,
    component: UserCreateComponent,
    canActivate: [AuthGuard],
  },
];
