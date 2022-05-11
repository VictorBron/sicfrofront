import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin, Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Driver } from './../../../drivers/models/driver.model';
import { Vehicle } from './../../../vehicles/models/vehicle.model';
import { DriversService } from './../../../drivers/services/drivers.service';
import { VehiclesService } from './../../../vehicles/services/vehicles.service';
import { Request, RequestMassive } from '../../models';
import {
  getDate,
  getTimeSpan,
  isRUTOk,
  isPatentOk,
  dateEarlierThanNow,
  openDialog,
  addElementSets,
} from '../../../../shared/utils';
import { FileService, NotificationService, LoadingService, PermissionService } from './../../../../shared/services';
import {
  ErrorResponse,
  ModalDialogResult,
  ModalActionType,
  ModalResponse,
  SnackModelEmitter,
  TableItem,
} from './../../../../shared/models';
import { TOOLTIPS, SNACK_CLASS, openErrorSnack, PERMISSIONS } from './../../../../shared/constants';
import { ModalDialogComponent } from '../../../../shared/components/modal';
import {
  ERRORS_REQUESTS_MASSIVE,
  FILE_TABLE_HEADERS,
  isUnique,
  parseRequestMassive,
  UPLOAD_REQUEST_LIST_TABLE_DEF_HEADERS,
} from '../../constants/upload-file';
import { RequestsService } from '../../services';
import { APP_URLS } from '../../../../shared/constants/urls';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class RequestUploadFileComponent implements OnInit, OnDestroy {
  public fileName: string = '';
  public requests: Request[] = [];
  public requestsTable: RequestMassive[] = [];
  public rowsWithError: Set<number> = new Set<number>();
  public TOOLTIPS = TOOLTIPS;
  public FILE_TABLE_HEADERS = FILE_TABLE_HEADERS;
  public displayedColumnsRequestsUpload: string[] = UPLOAD_REQUEST_LIST_TABLE_DEF_HEADERS;
  public dataSource = new MatTableDataSource<TableItem>();
  private dialogInstance: MatDialogRef<ModalDialogComponent, any> = null;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _fileSubscribe: Subscription = new Subscription();
  private globalId: number = 1;

  constructor(
    private translateService: TranslateService,
    private vehiclesService: VehiclesService,
    private driversService: DriversService,
    private loadingService: LoadingService,
    private router: Router,
    private fileService: FileService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private requestService: RequestsService,
    private permissionService: PermissionService,
  ) {}

  public ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.REQUEST.CREATE]);
    this.clean();
    this.translateService.get('REQUEST_NEW.UPLOAD.SELECT').subscribe((translated: string) => {
      this.fileName = translated;
    });
    this._fileSubscribe = this.startFileListener();
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.unsubscribe();
    this._fileSubscribe.unsubscribe();
  }

  public rowHasError = (element: RequestMassive): boolean => (this.rowsWithError.has(element.IdRow) ? true : false);

  public tableHasError = (): boolean => this.rowsWithError && this.rowsWithError.size > 0;

  public uploadedFile(event: any) {
    this.loadingService.showLoading();
    this.clean();
    this.fileName = event.target.files[0].name;
    this.fileService.loadFile(event);
  }

  public onCancelButtonClick = (): void => this.clean();

  public downloadTemplate(): void {
    this.fileService.downloadRequestTemplate();
  }

  public submitCreateMassiveRequest() {
    if (this.requestsTable.length === 0) {
      this.notificationService.snack$.next({
        message: 'REQUEST_NEW.UPLOAD.SNACK.NO_ELEMENTS',
        action: 'SNACK.ACTIONS.OK',
        class: SNACK_CLASS.ERROR,
      } as SnackModelEmitter);
      return;
    }
    if (this.tableHasError()) {
      this.notificationService.snack$.next({
        message: 'REQUEST_NEW.UPLOAD.SNACK.ERRORS',
        action: 'SNACK.ACTIONS.OK',
        class: SNACK_CLASS.ERROR,
      } as SnackModelEmitter);
      return;
    }
    this.loadingService.showLoading();

    let driverSet: Set<Driver> = new Set<Driver>();
    let vehicleSet: Set<Vehicle> = new Set<Vehicle>();

    this.requestsTable.forEach((row: RequestMassive) => {
      const driver: Driver = {
        Name: row.Driver_Name,
        LastName: row.Driver_LastName,
        RUT: row.Driver_RUT,
        Telephone: row.Driver_Telephone,
      };
      addElementSets(driverSet, driver, 'RUT');

      const vehicle: Vehicle = {
        Patent: row.Patent,
      };
      addElementSets(vehicleSet, vehicle, 'Patent');
    });

    forkJoin({
      drivers: this.postDriversObs(Array.from(driverSet)),
      vehicles: this.postVehiclesObs(Array.from(vehicleSet)),
    })
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(obsRes => {
        if (obsRes) {
          const checkDrivers = obsRes.drivers as ErrorResponse;
          const checkVehicles = obsRes.vehicles as ErrorResponse;
          if (checkDrivers && checkVehicles && checkDrivers.Error && checkVehicles.Error) {
            openErrorSnack(this.notificationService);
          } else {
            (obsRes.drivers as Driver[]).forEach(element => {
              this.requestsTable
                .filter(row => row.Driver_RUT.toUpperCase() === element.RUT)
                .forEach(row => (row.Driver = element));
            });
            (obsRes.vehicles as Vehicle[]).forEach(element => {
              this.requestsTable
                .filter(row => row.Patent.toUpperCase() === element.Patent)
                .forEach(row => (row.Vehicle = element));
            });

            this.setUpDialog();
          }
        }
      });
  }

  public getDate = (date: Date): string => getDate(date);

  public getTimeSpan = (timeSpan: Date): string => getTimeSpan(new Date(timeSpan));

  private setUpDialog(): void {
    this.dialogInstance = openDialog(
      this.dialog,
      ModalActionType.Accept,
      'REQUEST_NEW.UPLOAD.MODAL.VALIDATE_TITLE',
      'REQUEST_NEW.UPLOAD.MODAL.VALIDATE_TEXT',
      1,
      'REQUEST_NEW.UPLOAD.MODAL.REQUESTS_VALIDATE',
      '',
      'REQUEST_NEW.UPLOAD.MODAL.REQUESTS_CONFIRM',
    );
    this.listenDialogResponse();
  }

  private listenDialogResponse(): void {
    this.dialogInstance.afterClosed().subscribe((response: ModalDialogResult) => {
      if (response && response.buttonId === ModalResponse.Ok && this.rowsWithError.size === 0) {
        this.dialogInstance.close();
        this.loadingService.showLoading();
        const requests: Request[] = parseRequestMassive(this.requestsTable);

        this.requestService
          .addRequests(requests)
          .pipe(finalize(() => this.loadingService.hideLoading()))
          .pipe(takeUntil(this._ngUnsubscribe))
          .subscribe(ids => {
            const error = ids as ErrorResponse;
            if (error && error.Error) {
              openErrorSnack(this.notificationService);
            } else {
              this.notificationService.snack$.next({
                message: 'SNACK.SUCCESS',
                action: 'SNACK.ACTIONS.OK',
                class: SNACK_CLASS.SUCCESS,
              } as SnackModelEmitter);
            }
            setTimeout(() => {
              this.navigateRequestList();
            }, 500);
          });
      }
    });
  }

  public navigateRequestList = (): Promise<boolean> => this.router.navigate([APP_URLS.REQUESTS_LIST.path]);

  private postDriversObs = (drivers: Driver[]): Observable<Driver[] | ErrorResponse> =>
    this.driversService.addDrivers(drivers).pipe(takeUntil(this._ngUnsubscribe));

  private postVehiclesObs = (vehicles: Vehicle[]): Observable<Vehicle[] | ErrorResponse> =>
    this.vehiclesService.addVehicles(vehicles).pipe(takeUntil(this._ngUnsubscribe));

  private initExcelData(request: any): void {
    const startHour: Date = new Date(request[2]);
    const endHour: Date = new Date(request[3]);

    const requestMassive: RequestMassive = {
      IdRow: this.globalId,
      ValidityStart: new Date(request[0]),
      ValidityEnd: new Date(request[1]),
      ValidityStartHour: `${startHour.getHours()}:${startHour.getMinutes()}`,
      ValidityEndHour: `${endHour.getHours()}:${endHour.getMinutes()}`,
      IndustrialShed: String(request[4]),
      DestinyClient: String(request[5]),
      Product: String(request[6]),
      Format: String(request[7]),
      NumAgreement: String(request[8]),
      OC: String(request[9]),
      NumAgris: String(request[10]),
      DestinyDirection: String(request[11]),
      Driver_RUT: String(request[12]),
      Driver_Name: String(request[13]),
      Driver_LastName: String(request[14]),
      Driver_Telephone: String(request[15]),
      Patent: String(request[16]),
    };

    let hasNull: boolean = false;
    Object.keys(requestMassive).forEach(key => {
      if (!hasNull && !requestMassive[key as keyof typeof requestMassive]) {
        this.rowsWithError.add(request.IdRow);
        requestMassive.comment = ERRORS_REQUESTS_MASSIVE.NULL;
        hasNull = true;
      }
    });

    this.requestsTable.push(requestMassive);
    this.checkError(requestMassive);
    this.globalId++;
  }

  private checkError(request: RequestMassive): void {
    if (isNaN(request.ValidityStart.getMilliseconds()) || isNaN(request.ValidityEnd.getMilliseconds())) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.INVALID_DATE;
      return;
    }

    let startHours: string[] = request.ValidityStartHour.split(':');
    let endHours: string[] = request.ValidityEndHour.split(':');

    if (request.ValidityStart > request.ValidityEnd) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.START_DATE;
      return;
    } else if (
      Number(startHours[0]) > Number(endHours[0]) ||
      (Number(startHours[0]) === Number(endHours[0]) && Number(startHours[1]) > Number(endHours[1]))
    ) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.START_DATE_HOUR;
      return;
    } else if (dateEarlierThanNow(request.ValidityStart, request.ValidityEndHour)) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.END_DATE_TODAY;
      return;
    }

    const rut: string[] = request.Driver_RUT.split('-');
    if (!rut[1] || !isRUTOk(Number(rut[0]), rut[1].toUpperCase())) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.RUT;
      return;
    }

    if (!isUnique(this.requestsTable, request, 'Driver_RUT')) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.RUT_REPEAT;
      return;
    }

    if (!request.Patent || !isPatentOk(request.Patent)) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.PATENT;
      return;
    }

    if (!isUnique(this.requestsTable, request, 'Patent')) {
      this.rowsWithError.add(request.IdRow);
      request.comment = ERRORS_REQUESTS_MASSIVE.PATENT_REPEAT;
      return;
    }
  }

  private startFileListener(): Subscription {
    return this.fileService.obs.pipe(takeUntil(this._ngUnsubscribe)).subscribe((dataRead: unknown[]) => {
      if (dataRead && dataRead.length > 0) {
        dataRead.forEach((requestRow: any) => this.initExcelData(requestRow));

        // Mapping visual table
        const tableItem: TableItem[] = this.requestsTable?.map(elm => {
          return this.mappingTable(elm);
        });
        this.dataSource.data = tableItem;
      }
      this.loadingService.hideLoading();
    });
  }

  private mappingTable(elm: RequestMassive): TableItem {
    return {
      IdRow: elm.IdRow,
      ValidityStart: getDate(elm.ValidityStart),
      ValidityEnd: getDate(elm.ValidityEnd),
      ValidityStartHour: getTimeSpan(elm.ValidityStartHour),
      ValidityEndHour: getTimeSpan(elm.ValidityEndHour),
      IndustrialShed: elm.IndustrialShed,
      DestinyClient: elm.DestinyClient,
      Product: elm.Product,
      Format: elm.Format,
      NumAgreement: elm.NumAgreement,
      OC: elm.OC,
      NumAgris: elm.NumAgris,
      DestinyDirection: elm.DestinyDirection,
      Driver_RUT: elm.Driver_RUT,
      Driver_Name: elm.Driver_Name,
      Driver_LastName: elm.Driver_LastName,
      Driver_Telephone: elm.Driver_Telephone,
      Patent: elm.Patent,
      comment: elm.comment,
    } as unknown as TableItem;
  }

  private clean(): void {
    this.fileName = '';
    this.requestsTable = [];
    this.requests = [];
    this.dataSource.data = [];
    this.globalId = 1;
    this.rowsWithError.clear();
  }
}
