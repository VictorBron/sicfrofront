import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URLS } from '../constants';
import { AuthenticationService } from '../services/authentication';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getCurrentTokenCode();
    if (request.url.indexOf(API_URLS.LOGIN.path) === -1) {
      if (token) {
        request = request.clone({
          setHeaders: {
            tokenCode: `${this.auth.getCurrentTokenCode()}`,
          },
        });
      }
      this.auth.renewTimeExpiration();
    }
    return next.handle(request);
  }
}
