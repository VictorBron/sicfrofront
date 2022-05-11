import { Routes } from '@angular/router';
import { APP_URLS } from '../../shared/constants';
import { AuthGuard } from '../../shared/guards';
import { ScheduleCreateComponent, SchedulesListComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    component: SchedulesListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.SCHEDULE_DETAIL.shortPath,
    component: ScheduleCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.SCHEDULE_CREATE.shortPath,
    component: ScheduleCreateComponent,
    canActivate: [AuthGuard],
  },
];
