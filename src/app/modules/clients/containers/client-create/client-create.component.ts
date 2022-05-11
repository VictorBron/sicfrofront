import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_URLS, FORM_TYPES } from '../../../../shared/constants';
import { PERMISSIONS } from '../../../../shared/constants/common';
import { PermissionService } from '../../../../shared/services/permission-service';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss'],
})
export class ClientCreateComponent implements OnInit {
  public formType: FORM_TYPES = FORM_TYPES.CREATE_FORM;

  constructor(private router: Router, private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.formType = this.router.url?.includes(APP_URLS.CLIENT_CREATE.path)
      ? FORM_TYPES.CREATE_FORM
      : FORM_TYPES.DETAIL_FORM;
    this.checkPermission();
  }

  private checkPermission() {
    if (this.formType === FORM_TYPES.CREATE_FORM) {
      this.permissionService.checkAndRedirect([PERMISSIONS.CLIENT.CREATE]);
    } else {
      this.permissionService.checkAndRedirect([PERMISSIONS.CLIENT.READ]);
    }
  }
}
