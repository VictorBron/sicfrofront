import { Routes } from '@angular/router';
import { APP_URLS } from '../../shared/constants';
import { AuthGuard } from '../../shared/guards';
import { DriverCreateComponent, DriversListComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    component: DriversListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.DRIVER_CREATE.shortPath,
    component: DriverCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.DRIVER_DETAIL.shortPath,
    component: DriverCreateComponent,
    canActivate: [AuthGuard],
  },
];
