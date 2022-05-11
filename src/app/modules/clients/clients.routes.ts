import { Routes } from '@angular/router';
import { APP_URLS } from '../../shared/constants';
import { AuthGuard } from '../../shared/guards';
import { ClientsListComponent } from './containers';
import { ClientCreateComponent } from './containers/client-create/client-create.component';

export const routes: Routes = [
  {
    path: APP_URLS.CLIENTS_LIST.shortPath,
    component: ClientsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.CLIENT_CREATE.shortPath,
    component: ClientCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.CLIENT_DETAIL.shortPath,
    component: ClientCreateComponent,
    canActivate: [AuthGuard],
  },
];
