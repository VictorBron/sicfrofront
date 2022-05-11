import { finalize, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RequestsService } from '../../services';
import { Request, VehicleDriver } from '../../models';
import { getTimeSpan } from '../../../../shared/utils';
import { getRequestState } from '../../constants/request-state.constants';
import { LoadingService, PermissionService, NotificationService } from '../../../../shared/services';
import {
  APP_URLS,
  ERROR_HTTP_KEYS,
  FORM_TYPES,
  itemNotInDb,
  PERMISSIONS,
  SNACK_CLASS,
} from '../../../../shared/constants';
import { ErrorResponse, SnackModelEmitter } from '../../../../shared/models';
import { openErrorSnack } from '../../../../shared/constants/snack/snack-direct.constants';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit {
  public requestFormGroup: FormGroup;
  public dateToday: Date = new Date();
  public minDate: Date = this.dateToday;
  public requestOriginal: Request;
  public formType: FORM_TYPES = FORM_TYPES.DETAIL_FORM;
  public vehicleDriver: VehicleDriver[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestsService,
    private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.permissionService.checkAndRedirect([PERMISSIONS.REQUEST.READ]);
    this.loadForm();
    this.fetchRequest(this.activatedRoute.snapshot.params.id);
  }

  private fetchRequest(id: number) {
    this.loadingService.showLoading();
    this.requestService
      .getRequestId(id)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(request => {
        const error = request as ErrorResponse;
        if (error && error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.ITEM_NOT_IN_DB)
            itemNotInDb(this.notificationService, this.router, [APP_URLS.REQUESTS_LIST.path]);
          else openErrorSnack(this.notificationService);
        } else {
          const tmpRequest = request as Request;
          if (tmpRequest && tmpRequest.NumRequest) {
            this.setFormData(tmpRequest);
            this.requestOriginal = tmpRequest;
          }
        }
      });
  }

  public onGoBackButtonClick() {
    this.router.navigate([APP_URLS.REQUESTS_LIST.path]);
  }

  private setFormData(request: Request) {
    this.requestFormGroup.get('validityStart').setValue(request.ValidityStart);
    this.requestFormGroup.get('validityEnd').setValue(request.ValidityEnd);
    this.requestFormGroup.get('validityStartHour').setValue(getTimeSpan(request.ValidityStartHour));
    this.requestFormGroup.get('validityEndHour').setValue(getTimeSpan(request.ValidityEndHour));
    this.requestFormGroup.get('numAgris').setValue(request.NumAgris);
    this.requestFormGroup.get('numAgreement').setValue(request.NumAgreement);
    this.requestFormGroup.get('requestState').setValue(getRequestState(request.Active, request.ValidityEnd).id);
    this.requestFormGroup.get('OC').setValue(request.OC);
    this.requestFormGroup.get('product').setValue(request.Product);
    this.requestFormGroup.get('destinyClient').setValue(request.DestinyClient);
    this.requestFormGroup.get('destinyDirection').setValue(request.DestinyDirection);
    this.requestFormGroup.get('industrialShed').setValue(request.IndustrialShed);
    this.requestFormGroup.get('format').setValue(request.Format);
    this.vehicleDriver = request.VehicleDriver;
    this.requestFormGroup.disable();
  }

  private loadForm() {
    this.requestFormGroup = this.formBuilder.group({
      validityStart: [this.dateToday, Validators.required],
      validityEnd: [this.dateToday, Validators.required],
      validityStartHour: ['', Validators.required],
      validityEndHour: ['', Validators.required],
      numAgris: ['', Validators.required],
      numAgreement: ['', Validators.required],
      OC: ['', Validators.required],
      requestState: ['', Validators.required],
      product: ['', Validators.required],
      destinyClient: ['', Validators.required],
      destinyDirection: ['', Validators.required],
      industrialShed: ['', Validators.required],
      format: ['', Validators.required],
    });
  }

  private showSnack(message: string, _class: string) {
    this.notificationService.snack$.next({
      message: message,
      action: 'SNACK.ACTIONS.OK',
      class: _class,
    } as SnackModelEmitter);
  }
}
