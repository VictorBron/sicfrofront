import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { APP_URLS } from '../constants';
import { AuthenticationService } from '../services';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(): boolean {
    if (this.authService.getCurrentToken()) {
      this.router.navigate([APP_URLS.SCHEDULES_LIST.path]);
      return false;
    }
    return true;
  }
}
