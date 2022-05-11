import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle, VehicleType } from '../models';
import { VehiclesServiceModule } from './vehicles-service.module';
import { ErrorResponse, RequestParams } from './../../../shared/models';
import { ApiService } from '../../../shared/services';
import { API_URLS } from '../../../shared/constants';
import { generateQueryParamsFromObject, copyDeepObject, getParamsFromArray } from '../../../shared/utils';

@Injectable({
  providedIn: VehiclesServiceModule,
})
export class VehiclesService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  public getAllVehicles(): Observable<Vehicle[] | ErrorResponse> {
    return this.http.get<Vehicle[]>(this.apiService.getApiUrl(copyDeepObject(API_URLS.GET_VEHICLES)));
  }

  public getVehiclesByPatent(filter: RequestParams): Observable<Vehicle[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.GET_VEHICLES);
    const params = generateQueryParamsFromObject<RequestParams>(filter);
    return this.http.get<Vehicle[]>(url, { params });
  }

  public getEachVehiclesByPatent(patents: string[]): Observable<Vehicle[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.GET_VEHICLES_PATENT);
    const params = getParamsFromArray(patents, 'patents');
    return this.http.get<Vehicle[]>(url, { params });
  }

  public getVehicleById(idVehicle: number): Observable<Vehicle | ErrorResponse> {
    const api = copyDeepObject(API_URLS.GET_VEHICLE_BY_ID);
    api.params.id.value = String(idVehicle);
    const url = this.apiService.getApiUrl(api);
    return this.http.get<Vehicle>(url);
  }

  public getVehicleTypes(): Observable<VehicleType[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.GET_VEHICLE_TYPES);
    return this.http.get<VehicleType[]>(url);
  }

  public editVehicle(vehicle: Vehicle): Observable<Vehicle | ErrorResponse> {
    const api = copyDeepObject(API_URLS.GET_VEHICLE_BY_ID);
    api.params.id.value = String(vehicle.IdVehicle);
    const url = this.apiService.getApiUrl(api);
    return this.http.put<Vehicle>(url, { vehicle: vehicle });
  }

  public addVehicle(vehicle: Vehicle): Observable<Vehicle | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.POST_VEHICLE);
    return this.http.post<Vehicle>(url, vehicle);
  }

  public addVehicles(vehicles: Vehicle[]): Observable<Vehicle[] | ErrorResponse> {
    const url = this.apiService.getApiUrl(API_URLS.POST_VEHICLES);
    return this.http.post<Vehicle[]>(url, vehicles);
  }

  public deleteVehicle(id: number): Observable<Boolean | ErrorResponse> {
    const api = copyDeepObject(API_URLS.DELETE_VEHICLE);
    api.params.id.value = String(id);
    const url = this.apiService.getApiUrl(api);
    return this.http.delete<Boolean>(url);
  }
}
