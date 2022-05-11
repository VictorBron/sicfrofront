import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../shared/constants';
import { ErrorResponse } from '../../../shared/models';
import { ApiService } from '../../../shared/services';
import { copyDeepObject } from '../../../shared/utils';
import { User } from '../models';
import { UsersServiceModule } from './users-service.module';

@Injectable({
  providedIn: UsersServiceModule,
})
export class UsersService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiService.getApiUrl(API_URLS.GET_USERS));
  }
  public getUserById(idUser: number): Observable<User | ErrorResponse> {
    const api = copyDeepObject(API_URLS.GET_USER_BY_ID);
    api.params.id.value = String(idUser);
    const url = this.apiService.getApiUrl(api);
    return this.http.get<User>(url);
  }
  public createUser(user: User): Observable<number[] | ErrorResponse> {
    const api = copyDeepObject(API_URLS.CREATE_USER);
    const url = this.apiService.getApiUrl(api);
    return this.http.post<number[]>(url, user);
  }

  public editUser(user: User): Observable<User | ErrorResponse> {
    const api = copyDeepObject(API_URLS.EDIT_USER_BY_ID);
    api.params.id.value = String(user.IdUser);
    const url = this.apiService.getApiUrl(api);
    return this.http.put<User>(url, { User: user });
  }

  public deleteUser(id: number): Observable<Boolean | ErrorResponse> {
    const api = copyDeepObject(API_URLS.DELETE_USER);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http.delete<Boolean>(url);
  }
}
