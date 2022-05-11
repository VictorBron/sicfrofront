import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_URLS, FORM_TYPES, PERMISSIONS } from '../../../../shared/constants';
import { PermissionService } from '../../../../shared/services';

@Component({
  selector: 'app-vehicle-create',
  templateUrl: './vehicle-create.component.html',
  styleUrls: ['./vehicle-create.component.scss'],
})
export class VehicleCreateComponent implements OnInit {
  public formType: FORM_TYPES = FORM_TYPES.CREATE_FORM;

  constructor(private router: Router, private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.formType = this.router.url?.includes(APP_URLS.VEHICLE_CREATE.path)
      ? FORM_TYPES.CREATE_FORM
      : FORM_TYPES.DETAIL_FORM;

    this.checkPermission();
  }

  private checkPermission() {
    if (this.formType === FORM_TYPES.CREATE_FORM) {
      this.permissionService.checkAndRedirect([PERMISSIONS.VEHICLE.CREATE]);
    } else {
      this.permissionService.checkAndRedirect([PERMISSIONS.VEHICLE.READ]);
    }
  }
}
