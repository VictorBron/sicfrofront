import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { getVehicleColumnsDef } from '../../constants';
import { Vehicle } from '../../models';
import { VehiclesService } from '../../services';
import { CommonObject, ErrorResponse, TableItem } from '../../../../shared/models';
import { getNavigationUrl } from '../../../../shared/utils';
import { PERMISSIONS, getCommonOptions, APP_URLS, ID_PARAM, openErrorSnack } from '../../../../shared/constants';
import { ActionTableRow, ColumnDefinition, OverlayOption } from '../../../../shared/modules/table/models';
import { LoadingService } from '../../../../shared/services/loading-service';
import { PermissionService, NotificationService } from '../../../../shared/services';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent implements OnInit {
  public vehicles: TableItem[] = [];
  public optionsRowTable: OverlayOption[] = [];
  public columsDef: ColumnDefinition[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private vehicleService: VehiclesService,
    private router: Router,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private permissionService: PermissionService,
  ) {
    /* empty block */
  }

  ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.VEHICLE.READ]);
    this.fetchVehicles();
    this.setTableConfiguration();
  }

  private fetchVehicles(): void {
    this.loadingService.showLoading();
    this.vehicleService
      .getAllVehicles()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(vehicles => {
        const error = vehicles as ErrorResponse;
        if (error && error.Error) {
          openErrorSnack(this.notificationService);
        } else {
          this.vehicles = (vehicles as Vehicle[])?.map(vehicle => {
            return {
              IdVehicle: vehicle.IdVehicle,
              VehicleType: vehicle.VehicleType.Name,
              Patent: vehicle.Patent,
            };
          });
        }
      });
  }

  public onCreateButtonClick(): void {
    this.router.navigate([APP_URLS.VEHICLE_CREATE.path]);
  }
  public onDetailButtonClick(vehicle: Vehicle): void {
    this.router.navigate([getNavigationUrl(APP_URLS.VEHICLE_DETAIL.path, { [ID_PARAM]: vehicle?.IdVehicle })]);
  }

  private setTableConfiguration() {
    const options: ActionTableRow = {
      detail: (row: CommonObject) => this.onDetailButtonClick(row),
    };
    this.optionsRowTable = getCommonOptions(options);
    this.columsDef = getVehicleColumnsDef();
  }
}
