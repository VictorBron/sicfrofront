import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_URLS, FORM_TYPES, PERMISSIONS } from '../../../../shared/constants';
import { PermissionService } from '../../../../shared/services';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  public formType: FORM_TYPES = FORM_TYPES.CREATE_FORM;

  constructor(private router: Router, private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.formType = this.router.url?.includes(APP_URLS.USER_CREATE.path)
      ? FORM_TYPES.CREATE_FORM
      : FORM_TYPES.DETAIL_FORM;
    this.checkPermission();
  }

  private checkPermission() {
    if (this.formType === FORM_TYPES.CREATE_FORM) {
      this.permissionService.checkAndRedirect([PERMISSIONS.USER.CREATE]);
    } else {
      this.permissionService.checkAndRedirect([PERMISSIONS.USER.READ]);
    }
  }
}
