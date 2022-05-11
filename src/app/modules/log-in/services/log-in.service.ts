import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS, AUTH_HEADER, TOKEN_CODE_HEADER } from '../../../shared/constants';
import { ErrorResponse } from '../../../shared/models';
import { ApiService } from '../../../shared/services';
import { copyDeepObject, generateQueryParamsFromObject } from '../../../shared/utils';
import { LogInServiceModule } from './log-in-service.module';

@Injectable({
  providedIn: LogInServiceModule,
})
export class LogInService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  public requestToken(email: string): Observable<Boolean | ErrorResponse> {
    const api = copyDeepObject(API_URLS.REQUEST_TOKEN);
    const url = this.apiService.getApiUrl(api);
    const params = generateQueryParamsFromObject({ email: email });
    return this.http.get<Boolean>(url, { params });
  }

  public changePassword(auth: string, token: string): Observable<Boolean> {
    const api = copyDeepObject(API_URLS.CHANGE_PASS);
    const url = this.apiService.getApiUrl(api);
    let headers = new HttpHeaders().set(AUTH_HEADER, auth).set(TOKEN_CODE_HEADER, token);
    return this.http.get<Boolean>(url, { headers });
  }
}
