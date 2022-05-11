import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { APP_URLS, getCommonOptions, ID_PARAM, openErrorSnack, PERMISSIONS } from '../../../../shared/constants';
import { CommonObject, ErrorResponse, TableItem } from '../../../../shared/models';
import { ActionTableRow, ColumnDefinition, OverlayOption } from '../../../../shared/modules/table/models';
import { LoadingService, PermissionService, NotificationService } from '../../../../shared/services';
import { getDate, getNavigationUrl } from '../../../../shared/utils';
import { getUsertColumnsDef } from '../../constants';
import { User } from '../../models';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  public users: TableItem[] = [];
  public columsDef: ColumnDefinition[];
  public optionsRowTable: OverlayOption[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private loadingService: LoadingService,
    private usersService: UsersService,
    private router: Router,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.USER.READ]);
    this.setTableConfiguration();
    this.fetchData();
  }
  public onCreateButtonClick(): void {
    this.router.navigate([APP_URLS.USER_CREATE.path]);
  }
  public getDateString(date: Date): string {
    return getDate(new Date(date));
  }
  private fetchData(): void {
    this.loadingService.showLoading();
    this.usersService
      .getAllUsers()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(users => {
        const error = users as ErrorResponse;
        if (!users || error.Error) {
          openErrorSnack(this.notificationService);
        } else {
          this.users = users?.map(element => {
            return {
              IdUser: element.IdUser,
              Login: element.Login,
              Name: `${element.Name} ${element.LastName}`,
              RUT: element.RUT,
              Telephone: element.Telephone,
              Email: element.Email,
              ClientName: element.Client?.Name ?? '',
              LastEntry: this.getDateString(element.LastEntry),
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
    this.columsDef = getUsertColumnsDef();
  }

  private onDetailButtonClick(user: User): void {
    this.router.navigate([getNavigationUrl(APP_URLS.USER_DETAIL.path, { [ID_PARAM]: user?.IdUser })]);
  }
}
