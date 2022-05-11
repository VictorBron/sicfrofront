import { Routes } from '@angular/router';
import { RequestNewComponent, RequestDetailComponent, RequestListComponent, RequestEditComponent } from './containers';
import { RequestUploadFileComponent } from './components/request-upload-file/upload-file.component';
import { AuthGuard } from '../../shared/guards';
import { APP_URLS } from '../../shared/constants';

export const routes: Routes = [
  {
    path: '',
    component: RequestListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.REQUESTS_NEW.shortPath,
    component: RequestNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.REQUEST_DETAIL.shortPath,
    component: RequestDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.REQUEST_EDIT.shortPath,
    component: RequestEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: APP_URLS.REQUEST_UPLOAD.shortPath,
    component: RequestUploadFileComponent,
    canActivate: [AuthGuard],
  },
];
