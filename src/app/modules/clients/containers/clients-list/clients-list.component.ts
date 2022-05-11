import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { PERMISSIONS, getCommonOptions, APP_URLS, ID_PARAM, openErrorSnack } from '../../../../shared/constants';
import { CommonObject, ErrorResponse, TableItem } from '../../../../shared/models';
import { ActionTableRow, ColumnDefinition, OverlayOption } from '../../../../shared/modules/table/models';
import { LoadingService, PermissionService, NotificationService } from '../../../../shared/services';
import { getNavigationUrl } from '../../../../shared/utils';
import { getClientColumnsDef } from '../../constants';
import { Client } from '../../models/clients.model';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent implements OnInit {
  public clients: TableItem[] = [];
  public columsDef: ColumnDefinition[];

  public optionsRowTable: OverlayOption[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private clientsService: ClientsService,
    private loadingService: LoadingService,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.CLIENT.READ]);
    this.setTableConfiguration();
    this.fetchData();
  }

  public onCreateButtonClick(): void {
    this.router.navigate([APP_URLS.CLIENT_CREATE.path]);
  }

  private fetchData(): void {
    this.loadingService.showLoading();
    this.clientsService
      .getAllClients()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(clients => {
        const error = clients as ErrorResponse;
        if (error && error.Error) {
          openErrorSnack(this.notificationService);
        } else {
          this.clients = clients as TableItem[];
        }
      });
  }
  private setTableConfiguration() {
    const options: ActionTableRow = {
      detail: (row: CommonObject) => this.onDetailButtonClick(row),
    };
    this.optionsRowTable = getCommonOptions(options);
    this.columsDef = getClientColumnsDef();
  }

  private onDetailButtonClick(client: Client): void {
    this.router.navigate([getNavigationUrl(APP_URLS.CLIENT_DETAIL.path, { [ID_PARAM]: client?.IdClient })]);
  }
}
