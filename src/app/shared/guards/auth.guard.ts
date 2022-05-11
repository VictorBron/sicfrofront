import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { APP_URLS } from '../constants';
import { AuthenticationService } from '../services';

@Injectable()
/**
 * Allows or rejects the access to authenticated components
 */
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.getCurrentToken()) {
      return true;
    }
    this.router.navigate([APP_URLS.LOGIN.path]);
    return false;
  }
}
