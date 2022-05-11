import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { APP_URLS } from '../../constants';
import { AuthenticationService } from '../authentication';
import { AuthSession } from '../../models';
import { PermissionServiceModule } from './permissionService.module';
import { PERMISSION_TYPES, ROL_PERMISSIONS } from '../../constants/common';

@Injectable({
  providedIn: PermissionServiceModule,
})
export class PermissionService {
  private currentToken: AuthSession;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private auth: AuthenticationService, private router: Router) {
    this.subscribeToken();
  }

  public checkAndRedirect(permissions: string[]) {
    if (!this.hasPermission(permissions)) {
      this.router.navigate([APP_URLS.NOT_ALLOWED.path], { skipLocationChange: true });
    }
  }

  public hasPermission(permissions: string[]): boolean {
    const rolPermissions = ROL_PERMISSIONS[this.currentToken?.PermissionLevel as PERMISSION_TYPES];
    return permissions.some(perm => rolPermissions?.some(userPerm => perm === userPerm));
  }

  private subscribeToken() {
    this.auth.currentSession$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(token => {
      this.currentToken = token;
    });
  }
}
