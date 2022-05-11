import { finalize, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RequestsService } from '../../services';
import { Request } from '../../models';
import { getRequestState } from '../../constants/';
import { ErrorResponse } from '../../../../shared/models';
import { getTimeSpan, validatorHourStart, validatorHourEnd, validatorHour } from '../../../../shared/utils';
import { LoadingService, PermissionService, NotificationService } from '../../../../shared/services';
import {
  FORM_TYPES,
  PERMISSIONS,
  ERROR_HTTP_KEYS,
  APP_URLS,
  itemNotInDb,
  openErrorSnack,
} from '../../../../shared/constants';

@Component({
  selector: 'app-request-edit',
  templateUrl: './request-edit.component.html',
  styleUrls: ['./request-edit.component.scss'],
})
export class RequestEditComponent implements OnInit {
  public requestFormGroup: FormGroup;
  public dateToday: Date = new Date();
  public minDate: Date = this.dateToday;
  public requestOriginal: Request;
  public formType: FORM_TYPES = FORM_TYPES.EDIT_FORM;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestsService,
    private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.REQUEST.UPDATE]);
    this.loadForm();
    this.fetchRequest(this.activatedRoute.snapshot.params.id);
  }

  private fetchRequest(id: number): void {
    this.loadingService.showLoading();
    this.requestService
      .getRequestId(id)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(request => {
        const error = request as ErrorResponse;
        if (error && error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.ITEM_NOT_IN_DB)
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

  private setFormData(request: Request) {
    const dataParsed = {
      validityStart: request.ValidityStart,
      validityEnd: request.ValidityEnd,
      validityStartHour: getTimeSpan(request.ValidityStartHour),
      validityEndHour: getTimeSpan(request.ValidityEndHour),
      numAgris: request.NumAgris,
      numAgreement: request.NumAgreement,
      requestState: getRequestState(request.Active, request.ValidityEnd).id,
      OC: request.OC,
      product: request.Product,
      destinyClient: request.DestinyClient,
      destinyDirection: request.DestinyDirection,
      industrialShed: request.IndustrialShed,
      format: request.Format,
    };
    this.requestFormGroup.patchValue(dataParsed);

    if (request.disabled) this.requestFormGroup.disable();
  }

  private loadForm() {
    this.requestFormGroup = this.formBuilder.group(
      {
        validityStart: [this.dateToday, Validators.required],
        validityEnd: [this.dateToday, Validators.required],
        validityStartHour: ['', Validators.required],
        validityEndHour: ['', Validators.required],
        numAgris: ['', Validators.required],
        numAgreement: ['', Validators.required],
        OC: ['', Validators.required],
        requestState: [''],
        product: ['', Validators.required],
        destinyClient: ['', Validators.required],
        destinyDirection: ['', Validators.required],
        industrialShed: ['', Validators.required],
        format: ['', Validators.required],
      },
      {
        validator: [
          validatorHourStart('validityStartHour', 'validityEndHour'),
          validatorHourEnd('validityStartHour', 'validityEndHour'),
          validatorHour('validityStart', 'validityEndHour'),
        ],
      },
    );
  }
}
