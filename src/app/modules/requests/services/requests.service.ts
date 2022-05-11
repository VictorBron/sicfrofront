import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, RequestTable } from '../models';
import { API_URLS } from '../../../shared/constants';
import { ApiService } from '../../../shared/services';
import {
  convertStrToDate,
  convertStrToDateList,
  copyDeepObject,
  generateQueryParamsFromObject,
  setEditableAttribute,
} from '../../../shared/utils';
import { ErrorResponse, RequestParams } from './../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  public getAllRequests(filter: RequestParams): Observable<Request | RequestTable[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.GET_REQUESTS);
    const params = generateQueryParamsFromObject<RequestParams>(filter);
    return this.http.get<RequestTable[]>(url, { params }).pipe(
      map(res => convertStrToDateList(res, 'ValidityStart', 'ValidityEnd', 'Modified')),
      map(res => setEditableAttribute(res)),
    );
  }

  public getRequestId(id: number): Observable<Request | RequestTable[] | ErrorResponse> {
    const api = copyDeepObject(API_URLS.GET_REQUEST);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http.get<Request>(url).pipe(
      map(res => convertStrToDate(res, 'ValidityStart', 'ValidityEnd', 'Modified')),
      map(res => setEditableAttribute(res)),
    );
  }

  public addRequest(request: Request): Observable<number[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.POST_REQUEST);
    return this.http.post<number[]>(url, request);
  }

  public addRequests(requests: Request[]): Observable<number[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.POST_REQUESTS);
    return this.http.post<number[]>(url, requests);
  }

  public updateRequest(id: number, request: Request): Observable<RequestTable[] | ErrorResponse> {
    const api = copyDeepObject(API_URLS.UPDATE_REQUEST);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http
      .put<RequestTable[]>(url, request)
      .pipe(map(res => convertStrToDateList(res, 'ValidityStart', 'ValidityEnd', 'Modified')));
  }

  public updateRequestState(idRequest: number): Observable<Request | RequestTable | RequestTable[] | ErrorResponse> {
    const api = copyDeepObject(API_URLS.UPDATE_REQUEST_STATE);
    api.params.id.value = String(idRequest);
    const url = this.apiService.getApiUrl(api);
    return this.http.put<RequestTable>(url, {}).pipe(
      map(res => convertStrToDate(res, 'ValidityStart', 'ValidityEnd', 'Modified')),
      map(res => setEditableAttribute(res)),
    );
  }
}
