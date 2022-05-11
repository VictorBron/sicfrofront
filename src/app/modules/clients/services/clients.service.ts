import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/clients.model';
import { ClientsServiceModule } from './clients-service.module';
import { ErrorResponse } from './../../../shared/models';
import { ApiService, AuthenticationService } from '../../../shared/services';
import { API_URLS } from '../../../shared/constants';
import { copyDeepObject } from '../../../shared/utils';

@Injectable({
  providedIn: ClientsServiceModule,
})
export class ClientsService {
  constructor(private http: HttpClient, private apiService: ApiService, private auth: AuthenticationService) {}

  public getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiService.getApiUrl(API_URLS.GET_CLIENTS));
  }
  public createClient(client: Client): Observable<Client | ErrorResponse> {
    const api = copyDeepObject(API_URLS.CREATE_CLIENT);
    const url = this.apiService.getApiUrl(api);
    return this.http.post<Client>(url, { Client: client });
  }

  public updateClient(client: Client): Observable<Client | ErrorResponse> {
    const api = copyDeepObject(API_URLS.EDIT_CLIENT_BY_ID);
    api.params.id.value = String(client.IdClient);
    const url = this.apiService.getApiUrl(api);
    return this.http.put<Client>(url, { Client: client });
  }

  public getClientById(id: number): Observable<Client | ErrorResponse> {
    const api = copyDeepObject(API_URLS.GET_CLIENT_BY_ID);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http.get<Client>(url);
  }

  public deleteClient(id: number): Observable<Boolean | ErrorResponse> {
    const api = copyDeepObject(API_URLS.DELETE_CLIENT);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http.delete<Boolean>(url);
  }
}
