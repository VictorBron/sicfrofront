import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../../../shared/constants';
import { ErrorResponse, RequestParams } from '../../../shared/models';
import { ApiService } from '../../../shared/services';
import { copyDeepObject, generateQueryParamsFromObject, getParamsFromArray } from '../../../shared/utils';
import { Driver } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  public getAllDrivers(): Observable<Driver[] | ErrorResponse> {
    return this.http.get<Driver[]>(this.apiService.getApiUrl(API_URLS.GET_DRIVERS));
  }

  public getEachDriverByRUT(ruts: string[]): Observable<Driver[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.GET_DRIVERS_RUT);
    const params = getParamsFromArray(ruts, 'ruts');
    return this.http.get<Driver[]>(url, { params });
  }

  public addDriver(driver: Driver): Observable<Driver | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.POST_DRIVER);
    return this.http.post<Driver>(url, driver);
  }

  public addDrivers(drivers: Driver[]): Observable<Driver[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.POST_DRIVERS);
    return this.http.post<Driver[]>(url, drivers);
  }

  public getDriversByRUT(filter: RequestParams): Observable<Driver[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.GET_DRIVERS);
    const params = generateQueryParamsFromObject<RequestParams>(filter);
    return this.http.get<Driver[]>(url, { params });
  }

  public updateDriver(driver: Driver): Observable<Driver | ErrorResponse> {
    const api = copyDeepObject(API_URLS.GET_DRIVER_BY_ID);
    api.params.id.value = String(driver.IdDriver);
    const url = this.apiService.getApiUrl(api);
    return this.http.put<Driver>(url, { driver: driver });
  }

  public getDriverById(id: number): Observable<Driver | ErrorResponse> {
    const api = copyDeepObject(API_URLS.GET_DRIVER_BY_ID);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http.get<Driver>(url);
  }

  public deleteDriver(id: number): Observable<Boolean | ErrorResponse> {
    const api = copyDeepObject(API_URLS.DELETE_DRIVER);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http.delete<Boolean>(url);
  }
}
