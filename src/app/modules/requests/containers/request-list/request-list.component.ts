import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { LoadingService, FileService, NotificationService, PermissionService } from '../../../../shared/services';
import {
  getDate,
  getTimeSpan,
  translateGetNoHTTPLoader,
  getNavigationUrl,
  openDialog,
} from './../../../../shared/utils';
import {
  ErrorResponse,
  RequestParams,
  SnackModelEmitter,
  TableItem,
  ModalResponse,
  ModalActionType,
  ModalDialogResult,
} from './../../../../shared/models';
import { APP_URLS, TOOLTIPS, PERMISSIONS, ID_PARAM, openErrorSnack } from './../../../../shared/constants';
import { OverlayOption } from '../../../../shared/modules/table/models';
import { Request, RequestTable } from '../../models';
import { RequestsService } from '../../services';
import {
  getRequestState,
  getRequestStateById,
  getRequestStateByKey,
  REQUEST_LIST_TABLE_HEADERS,
  ActionTableRowRequestEdit,
  ActionTableRowRequestRead,
  getCommonOptionsRequestEdit,
  getCommonOptionsRequestRead,
  REQUEST_LIST_TABLE_DEF_HEADERS,
} from './../../constants';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  public TOOLTIPS = TOOLTIPS;
  public optionsRowTable: OverlayOption[] = [];
  public formGroupFilter: FormGroup;
  public showFilter: boolean = false;
  public showUpload: boolean = false;
  public dateToday: Date = new Date();
  public dataSource = new MatTableDataSource<TableItem>();
  public tableHeaders: string[] = [];
  public displayedColumnsRequests: string[] = REQUEST_LIST_TABLE_DEF_HEADERS;

  public hasCreate = this.permissionService.hasPermission([PERMISSIONS.REQUEST.CREATE]);
  public hasEditPermissions = this.permissionService.hasPermission([
    PERMISSIONS.REQUEST.CREATE,
    PERMISSIONS.REQUEST.UPDATE,
  ]);
  // Subject
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private requestService: RequestsService,
    private translateService: TranslateService,
    private router: Router,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private notificationService: NotificationService,
    private permissionService: PermissionService,
    private dialog: MatDialog,
  ) {
    /* empty block */
  }

  public ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.REQUEST.READ]);
    this.loadForm();
    this.fetchRequests();
    this.setTableConfiguration();
    this.tableHeaders = translateGetNoHTTPLoader(REQUEST_LIST_TABLE_HEADERS, this.translateService);
  }

  public changeFilterstatus() {
    this.showFilter = !this.showFilter;
  }

  public onCreateButtonClick(): void {
    this.router.navigate([APP_URLS.REQUESTS_NEW.path]);
  }

  public getDate = (date: Date): string => getDate(date);

  public getTimeSpan = (timeSpan: string): string => getTimeSpan(timeSpan);

  public getFullName = (name: string, lastName: string): string => `${lastName}, ${name}`;

  public getRequestState = (active: boolean, validityEnd: Date): string => getRequestState(active, validityEnd).text;

  public fetchRequests(): void {
    const validityStart = this.formGroupFilter.get('validityStart');

    if (validityStart.value === null || validityStart.errors) {
      this.notificationService.snack$.next({
        message: 'REQUEST_LIST.SNACK',
      } as SnackModelEmitter);
      return;
    }
    let startDate: Date = this.formGroupFilter.get('validityStart').value as Date;
    startDate.setHours(12, 0, 0);

    const filter: RequestParams = {
      From: startDate.toISOString().split('T')[0],
    };

    const validityEnd = this.formGroupFilter.get('validityEnd');
    if (validityEnd.dirty && validityEnd.value != null) {
      const endDate: Date = validityEnd.value as Date;
      endDate.setHours(12, 0, 0);
      filter.To = endDate.toISOString().split('T')[0];
    }

    const patent = this.formGroupFilter.get('patent');
    if (patent.dirty) filter.Patent = patent.value;

    const reqState = this.formGroupFilter.get('requestState');
    if (reqState.value !== getRequestStateByKey('ALL').id) filter.ActiveCode = getRequestStateById(reqState.value).id;

    const client = this.formGroupFilter.get('client');
    if (client.dirty && client.value.IdClient !== 0) filter.IdClient = client.value.IdClient;

    this.loadingService.showLoading();
    this.requestService
      .getAllRequests(filter)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(requests => {
        const error = requests as ErrorResponse;
        if (error && error.Error) {
        } else {
          const tmpRequest = requests as RequestTable[];
          const tableItem: TableItem[] = tmpRequest?.map(elm => {
            return this.mappingTable(elm);
          });
          this.dataSource.data = tableItem;
          this.setFiltersActivation(tableItem);
        }
      });
  }

  private setFiltersActivation(tableItem: TableItem[]) {
    if (tableItem) {
      this.dataSourceFiltered.data = tableItem.slice();
      this.length = tableItem.length;
      this.pageEvent({
        length: tableItem.length,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        previousPageIndex: 0,
      });
    }
  }

  private mappingTable(elm: RequestTable): TableItem {
    return {
      IdRequest: elm.IdRequest,
      NumRequest: elm.NumRequest,
      ValidityStart: getDate(elm.ValidityStart),
      ValidityEnd: getDate(elm.ValidityEnd),
      ValidityStartHour: elm.ValidityStartHour,
      ValidityEndHour: elm.ValidityEndHour,
      Modified: getDate(elm.Modified),
      ModifiedBy: elm.ModifiedBy,
      ClientName: elm.ClientName,
      DriverRUT: elm.DriverRUT,
      DriverName: elm.DriverName,
      VehiclePatent: elm.VehiclePatent,
      disabled: elm.disabled,
      state: this.translateService.instant(getRequestState(elm.Active, elm.ValidityEnd).text),
      Active: elm.Active as boolean,
      ValidityStartDate: elm.ValidityStart,
    } as unknown as TableItem;
  }

  public downloadTable(): void {
    let objectData: any[] = [];
    this.dataSource.data.forEach(row => objectData.push(this.getCSVObject(row)));
    let date: string[] = getDate(new Date()).split('/');
    let fileName: string = `solicitudes_${date[2]}_${date[1]}_${date[0]}`;
    this.fileService.downloadFileCSV(objectData, this.tableHeaders, fileName);
  }

  public navigateMassiveUpload = (): Promise<boolean> => this.router.navigate([APP_URLS.REQUEST_UPLOAD.path]);

  private getCSVObject(row: TableItem) {
    return {
      clientName: row.ClientName,
      patent: row.VehiclePatent,
      driverName: row.DriverName,
      driverRUT: row.DriverRUT,
      validityStart: row.ValidityStart,
      validityEnd: row.ValidityEnd,
      validityStartHour: row.ValidityStartHour,
      validityEndHour: row.ValidityEndHour,
      requestState: row.state,
      modifiedBy: row.ModifiedBy,
      modified: row.Modified,
    };
  }

  private onDetailButtonClick = (request: Request): Promise<boolean> =>
    this.router.navigate([getNavigationUrl(APP_URLS.REQUEST_DETAIL.path, { [ID_PARAM]: request.NumRequest })]);

  private onEditButtonClick = (request: Request): Promise<boolean> =>
    this.router.navigate([getNavigationUrl(APP_URLS.REQUEST_EDIT.path, { [ID_PARAM]: request.NumRequest })]);

  private onChangeStatusButtonClick(request: Request): void {
    openDialog(this.dialog, ModalActionType.YesCancel, 'MODAL.TITLE.INFORMATION', 'REQUESTS.MODAL.CONFIRM_TITLE')
      .afterClosed()
      .subscribe((data: ModalDialogResult) => {
        if (data && data.buttonId == ModalResponse.Ok) {
          this.loadingService.showLoading();
          this.requestService
            .updateRequestState(request.IdRequest)
            .pipe(finalize(() => this.loadingService.hideLoading()))
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(request => {
              const error = request as ErrorResponse;
              if (error && error.Error) {
                openErrorSnack(this.notificationService);
              } else {
                const tmpRequest = request as RequestTable;
                const index = this.dataSource.data.indexOf(
                  this.dataSource.data.find(req => Number(req.IdRequest) === tmpRequest.IdRequest),
                );
                this.updateTableRow(index, tmpRequest);
              }
            });
        }
      });
  }

  private updateTableRow(index: number, request: RequestTable): void {
    this.dataSource.data[index] = this.mappingTable(request);
    this.setFiltersActivation(this.dataSource.data);
  }

  private loadForm(): void {
    this.dateToday.setHours(0, 0, 0);
    this.formGroupFilter = this.formBuilder.group({
      validityStart: [this.dateToday, Validators.required],
      validityEnd: [''],
      patent: [''],
      requestState: [getRequestStateByKey('VALID').id],
      client: [''],
    });
  }

  private setTableConfiguration() {
    if (this.hasEditPermissions) {
      const options: ActionTableRowRequestEdit = {
        detail: (row: TableItem) => this.onDetailButtonClick(row),
        edit: (row: TableItem) => this.onEditButtonClick(row),
        changeStatus: (row: TableItem) => this.onChangeStatusButtonClick(row),
      };
      this.optionsRowTable = getCommonOptionsRequestEdit(this.translateService, options);
    } else {
      const options: ActionTableRowRequestRead = {
        detail: (row: TableItem) => this.onDetailButtonClick(row),
      };
      this.optionsRowTable = getCommonOptionsRequestRead(this.translateService, options);
    }
  }

  // MOVE TO-DO
  // TABLE
  public length = 0;
  public pageSize = 5;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public dataSourceFiltered = new MatTableDataSource<RequestTable>();
  public currentPageEvent: PageEvent;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  public pageEvent(pageEvent: PageEvent) {
    const start = pageEvent.pageIndex * pageEvent.pageSize;
    const end = start + pageEvent.pageSize;
    this.pageSize = pageEvent.pageSize;
    this.dataSourceFiltered.data = this.dataSource.data.slice(start, end);
    this.currentPageEvent = pageEvent;
  }

  public sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    const toFormat = ['Modified', 'ValidityEnd', 'ValidityStart'];
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
    } else {
      if (toFormat.some(e => sort.active === e)) {
        this.dataSource.data = data.sort((a, b) => {
          const aValue = (a as any)[sort.active].split('/');
          const aDate = new Date(aValue[2], aValue[1], aValue[0]);
          const bValue = (b as any)[sort.active].split('/');
          const bDate = new Date(bValue[2], bValue[1], bValue[0]);
          return (aDate < bDate ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
      } else {
        this.dataSource.data = data.sort((a, b) => {
          const aValue = (a as any)[sort.active];
          const bValue = (b as any)[sort.active];
          return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
      }
    }

    this.pageEvent(this.currentPageEvent);
  }
}
