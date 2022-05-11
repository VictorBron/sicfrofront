import { Routes } from '@angular/router';
import { APP_URLS } from '../../shared/constants';
import { VehicleListComponent } from './components/vehicle-list';
import { VehicleCreateComponent } from './components/vehicle-create';
import { AuthGuard } from '../../shared/guards';

export const routes: Routes = [
  {
    path: '',
    component: VehicleListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.VEHICLE_CREATE.shortPath,
    component: VehicleCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.VEHICLE_DETAIL.shortPath,
    component: VehicleCreateComponent,
    canActivate: [AuthGuard],
  },
];
