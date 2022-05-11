import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { PERMISSIONS, getCommonOptions, APP_URLS, ID_PARAM, openErrorSnack } from '../../../../shared/constants';
import { CommonObject, ErrorResponse, TableItem } from '../../../../shared/models';
import { ActionTableRow, ColumnDefinition, OverlayOption } from '../../../../shared/modules/table/models';
import { LoadingService, PermissionService, NotificationService } from '../../../../shared/services';
import { getNavigationUrl } from '../../../../shared/utils';
import { getDriverColumnsDef } from '../../constants';
import { Driver } from '../../models';
import { DriversService } from '../../services';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss'],
})
export class DriversListComponent implements OnInit {
  public drivers: TableItem[] = [];
  public columsDef: ColumnDefinition[];
  public optionsRowTable: OverlayOption[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private driversService: DriversService,
    private loadingService: LoadingService,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
  ) {}

  public ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.DRIVER.READ]);
    this.fetchData();
    this.setTableConfiguration();
  }

  public onCreateButtonClick(): void {
    this.router.navigate([APP_URLS.DRIVER_CREATE.path]);
  }

  public onDetailButtonClick(driver: Driver): void {
    this.router.navigate([getNavigationUrl(APP_URLS.DRIVER_DETAIL.path, { [ID_PARAM]: driver.IdDriver })]);
  }

  private fetchData(): void {
    this.loadingService.showLoading();
    this.driversService
      .getAllDrivers()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(drivers => {
        const error = drivers as ErrorResponse;
        if (error && error.Error) {
          openErrorSnack(this.notificationService);
        } else {
          this.drivers = (drivers as Driver[])?.map(element => {
            return {
              IdDriver: element.IdDriver,
              Name: element.Name,
              LastName: element.LastName,
              RUT: element.RUT,
            };
          });
        }
      });
  }

  private setTableConfiguration() {
    const options: ActionTableRow = {
      detail: (row: CommonObject) => this.onDetailButtonClick(row),
    };
    this.optionsRowTable = getCommonOptions(options);
    this.columsDef = getDriverColumnsDef();
  }
}
