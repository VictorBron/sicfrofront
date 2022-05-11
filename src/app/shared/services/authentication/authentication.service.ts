import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URLS, APP_URLS, AUTH_HEADER } from '../../constants';
import { AuthSession } from '../../models';
import { ApiService } from '../api-service';
import { AuthenticationServiceModule } from './authentication-service.module';
import { ExpireSessionService } from './../expire-session/expire-session.service';

const TOKEN = 'token';
@Injectable({
  providedIn: AuthenticationServiceModule,
})
export class AuthenticationService {
  public currentSession$ = new BehaviorSubject<AuthSession>(null);
  private currentToken: AuthSession;
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService,
    private expireSessionService: ExpireSessionService,
  ) {}

  public login(auth: string): Observable<AuthSession> {
    let headers = new HttpHeaders().set(AUTH_HEADER, auth);
    return this.http
      .get<AuthSession>(this.apiService.getApiUrl(API_URLS.LOGIN), {
        headers,
      })
      .pipe(map(result => this.setCurrentSession(result)));
  }

  public logout(): void {
    this.currentSession$.next(null);
    this.cookieService.delete(TOKEN, '/', null, false, 'Strict');

    this.currentToken = null;
    this.expireSessionService.secondsToExpire$.next(-1);
    this.router.navigate([APP_URLS.LOGIN.path]);
  }

  public getCurrentToken(): AuthSession {
    if (this.currentToken === undefined) {
      const tokenStr = this.cookieService.get(TOKEN);
      const token: AuthSession = tokenStr ? JSON.parse(tokenStr) : null;
      if (token) this.setCurrentSession(token);
    }
    return this.currentToken;
  }

  public getCurrentTokenCode(): string {
    return this.getCurrentToken()?.TokenCode;
  }

  public renewTimeExpiration(): void {
    this.expireSessionService.renewCounter$.next(true);
  }

  private setCurrentSession(result: AuthSession): AuthSession {
    if (!result.Code) {
      this.currentToken = result;
      this.cookieService.set(TOKEN, JSON.stringify(result), 0, '/', null, false, 'Strict');
      this.expireSessionService.secondsToExpire$.next(result.TimeExpiration);
      this.renewTimeExpiration();
      this.currentSession$.next(result);
    }
    return result;
  }
}
