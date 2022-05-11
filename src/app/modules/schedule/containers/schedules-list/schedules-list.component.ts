import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { APP_URLS, getCommonOptions, ID_PARAM, openErrorSnack, PERMISSIONS } from '../../../../shared/constants';
import { CommonObject, ErrorResponse, TableItem } from '../../../../shared/models';
import { ActionTableRow, ColumnDefinition, OverlayOption } from '../../../../shared/modules/table/models';
import { LoadingService, PermissionService, NotificationService } from '../../../../shared/services';
import { getDateWithoutTime, getNavigationUrl, getTimeString } from '../../../../shared/utils';
import { getScheduleColumnsDef } from '../../constants';
import { Schedule } from '../../models';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedules-list',
  templateUrl: './schedules-list.component.html',
  styleUrls: ['./schedules-list.component.scss'],
})
export class SchedulesListComponent implements OnInit {
  public schedules: TableItem[] = [];
  public columsDef: ColumnDefinition[];
  public optionsRowTable: OverlayOption[] = [];
  public hasCreate = this.permissionService.hasPermission([PERMISSIONS.SCHEDULE.CREATE]);
  public hasTableOptions = this.permissionService.hasPermission([
    PERMISSIONS.SCHEDULE.CREATE,
    PERMISSIONS.SCHEDULE.UPDATE,
  ]);

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private loadingService: LoadingService,
    private scheduleService: ScheduleService,
    private router: Router,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.SCHEDULE.READ]);
    this.setTableConfiguration();
    this.fetchData();
  }

  public onCreateButtonClick(): void {
    this.router.navigate([APP_URLS.SCHEDULE_CREATE.path]);
  }
  public getScheduleString(schedule: Schedule): string {
    const hFrom = schedule.HourFrom;
    const hTo = schedule.HourTo;
    return `${getTimeString(hFrom)} - ${getTimeString(hTo)}`;
  }

  public getDateString(date: Date): string {
    return getDateWithoutTime(new Date(date));
  }

  private fetchData(): void {
    this.loadingService.showLoading();
    this.scheduleService
      .getAllSchedules()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schedules => {
        const error = schedules as ErrorResponse;
        if (error && error.Error) {
          openErrorSnack(this.notificationService);
        } else {
          this.schedules = schedules?.map(element => {
            return {
              IdSchedule: element.IdSchedule,
              Client: element.Client?.Name ?? '',
              DayFrom: this.getDateString(element.DayFrom),
              DayTo: this.getDateString(element.DayTo),
              Schedule: this.getScheduleString(element),
              Comment: element.Comment,
            };
          });
        }
      });
  }

  private setTableConfiguration() {
    const options: ActionTableRow = {
      detail: (row: CommonObject) => this.onDetailButtonClick(row),
    };
    this.optionsRowTable = this.hasTableOptions ? getCommonOptions(options) : [];
    this.columsDef = getScheduleColumnsDef();
  }

  private onDetailButtonClick(schedule: Schedule): void {
    this.router.navigate([getNavigationUrl(APP_URLS.SCHEDULE_DETAIL.path, { [ID_PARAM]: schedule?.IdSchedule })]);
  }
}
