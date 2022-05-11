import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_URLS } from '../../../shared/constants';
import { ApiService, AuthenticationService } from '../../../shared/services';
import { copyDeepObject } from '../../../shared/utils';
import { Schedule } from '../models';
import { HoursSchedule } from '../models/hours-schedule.model';
import { SchedulesServiceModule } from './schedules-service.module';

@Injectable({
  providedIn: SchedulesServiceModule,
})
export class ScheduleService {
  constructor(private http: HttpClient, private apiService: ApiService, private auth: AuthenticationService) {}

  public getAllSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.apiService.getApiUrl(API_URLS.GET_SCHEDULES));
  }

  public getScheduleById(idSchedule: number): Observable<Schedule> {
    const api = copyDeepObject(API_URLS.GET_SCHEDULE_BY_ID);
    api.params.id.value = String(idSchedule);
    const url = this.apiService.getApiUrl(api);
    return this.http.get<Schedule>(url);
  }

  public createSchedule(schedule: Schedule): Observable<Schedule> {
    const api = copyDeepObject(API_URLS.CREATE_SCHEDULE);
    const url = this.apiService.getApiUrl(api);
    return this.http.post<Schedule>(url, {
      Schedule: schedule,
      HourFromString: schedule.HourFromString,
      HourToString: schedule.HourToString,
    });
  }

  public editSchedule(schedule: Schedule): Observable<Schedule> {
    const api = copyDeepObject(API_URLS.EDIT_SCHEDULE_BY_ID);
    api.params.id.value = String(schedule.IdSchedule);
    const url = this.apiService.getApiUrl(api);
    return this.http.put<Schedule>(url, {
      Schedule: schedule,
      HourFromString: schedule.HourFromString,
      HourToString: schedule.HourToString,
    });
  }
}
