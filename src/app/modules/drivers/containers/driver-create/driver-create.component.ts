import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_URLS, FORM_TYPES } from '../../../../shared/constants';
import { PERMISSIONS } from '../../../../shared/constants/common';
import { PermissionService } from '../../../../shared/services';

@Component({
  selector: 'app-driver-create',
  templateUrl: './driver-create.component.html',
  styleUrls: ['./driver-create.component.scss'],
})
export class DriverCreateComponent implements OnInit {
  public formType: FORM_TYPES = FORM_TYPES.CREATE_FORM;
  constructor(private router: Router, private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.formType = this.router.url?.includes(APP_URLS.DRIVER_CREATE.path)
      ? FORM_TYPES.CREATE_FORM
      : FORM_TYPES.DETAIL_FORM;
    this.checkPermission();
  }

  private checkPermission() {
    if (this.formType === FORM_TYPES.CREATE_FORM) {
      this.permissionService.checkAndRedirect([PERMISSIONS.DRIVER.CREATE]);
    } else {
      this.permissionService.checkAndRedirect([PERMISSIONS.DRIVER.READ]);
    }
  }
}
