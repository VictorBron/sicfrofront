import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { RequestStates, RequestState } from './../../constants/request-state.constants';
import { Client } from '../../../clients';
import { ClientsService } from '../../../clients/services/clients.service';
import {
  AuthenticationService,
  LoadingService,
  NotificationService,
  PermissionService,
} from './../../../../shared/services';
import { ErrorResponse } from './../../../../shared/models';
import { PERMISSION_TYPES, getTextByError, PERMISSIONS, openErrorSnack } from '../../../../shared/constants';

@Component({
  selector: 'app-request-list-table-filter',
  templateUrl: './request-list-table-filter.component.html',
  styleUrls: ['./request-list-table-filter.component.scss'],
})
export class RequestListTableFilterComponent implements OnInit {
  @Input() formGroupFilter: FormGroup;
  @Output() searchDataCallback = new EventEmitter<void>();
  public dateToday: Date = new Date();
  public minDate: Date = new Date();
  public requestStates: RequestState[] = RequestStates;
  public clients: Client[] = [];
  public userPermissions: string = '';
  public PERMISSION_TYPES = PERMISSION_TYPES;
  public canFilterByClient: boolean = this.permissionService.hasPermission([PERMISSIONS.REQUEST.FILTER]);
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private clientService: ClientsService,
    private loadingService: LoadingService,
    private auth: AuthenticationService,
    private translateService: TranslateService,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
  ) {}

  public ngOnInit(): void {
    this.userPermissions = this.auth.getCurrentToken()?.PermissionLevel;
    this.startDateListener();
    this.fetchClients();
  }

  public dateChange(newStartDate: Date) {
    this.minDate = newStartDate;
  }

  public onSearch(): void {
    this.searchDataCallback.emit();
  }

  public getTextByKey(key: string): string {
    return this.formGroupFilter.get(key).dirty ? getTextByError(this.formGroupFilter.get(key).errors) : '';
  }

  private fetchClients(): void {
    if (!this.canFilterByClient) return;

    this.loadingService.showLoading();
    this.clientService
      .getAllClients()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(clients => {
        const error = clients as ErrorResponse;
        if (error && error.Error) {
          openErrorSnack(this.notificationService);
        } else {
          const tmpClients = clients as Client[];
          let emptyClient: Client = {
            IdClient: 0,
            Name: this.translateService.instant('REQUEST_LIST.FILTER.ALL'),
          };
          tmpClients.unshift(emptyClient);
          this.clients = tmpClients.filter(client => client.Name != 'Froward');
        }
      });
  }

  private startDateListener(): void {
    this.formGroupFilter
      .get('validityStart')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: Date) => {
        if (data) {
          let endDate: Date = this.formGroupFilter.get('validityEnd').value;
          if (endDate < data) {
            this.minDate = data;
          }
        }
      });
  }
}
