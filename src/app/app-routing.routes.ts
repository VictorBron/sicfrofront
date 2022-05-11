import { Routes } from '@angular/router';
import { APP_URLS } from './shared/constants/urls/app-urls.constants';
import { NotAllowedComponent } from './shared/components';
import { AuthGuard } from './shared/guards';

export const routes: Routes = [
  {
    path: APP_URLS.LOGIN.path,
    loadChildren: () => import('./modules/log-in/log-in.module').then(m => m.LogInModule),
  },
  {
    path: APP_URLS.CLIENTS_LIST.path,
    loadChildren: () => import('./modules/clients/clients.module').then(m => m.ClientsModule),
  },
  {
    path: APP_URLS.DRIVERS_LIST.path,
    loadChildren: () => import('./modules/drivers/drivers.module').then(m => m.DriversModule),
  },
  {
    path: APP_URLS.REQUESTS_LIST.path,
    loadChildren: () => import('./modules/requests/requests.module').then(m => m.RequestModule),
  },
  {
    path: APP_URLS.SCHEDULES_LIST.path,
    loadChildren: () => import('./modules/schedule/schedule.module').then(m => m.ScheduleModule),
  },
  {
    path: APP_URLS.USERS_LIST.path,
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
  },
  {
    path: APP_URLS.VEHICLES_LIST.path,
    loadChildren: () => import('./modules/vehicles/vehicles.module').then(m => m.VehiclesModule),
  },
  {
    path: APP_URLS.NOT_ALLOWED.path,
    component: NotAllowedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: APP_URLS.SCHEDULES_LIST.path,
    pathMatch: 'full',
  },
];
