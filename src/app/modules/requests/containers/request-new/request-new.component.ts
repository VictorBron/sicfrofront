import { STEP_STATE } from '@angular/cdk/stepper';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { Request, VehicleDriver } from '../../models';
import { RequestsService } from './../../services/requests.service';
import { isCanceledState, getRequestStateByKey, FORM_BUTTONS, FORM_TITLES } from './../../constants';
import {
  LoadingService,
  NotificationService,
  PermissionService,
  FormValidatorService,
} from '../../../../shared/services';
import { TOOLTIPS, FORM_TYPES, PERMISSIONS, APP_URLS, SNACK_CLASS, openErrorSnack } from '../../../../shared/constants';
import {
  ErrorResponse,
  IFormValidator,
  ModalActionType,
  SnackModelEmitter,
  ModalDialogResult,
  ModalResponse,
} from '../../../../shared/models';
import {
  validatorHourStart,
  validatorHourEnd,
  openDialog,
  copyDeepObject,
  validatorHour,
} from '../../../../shared/utils';

@Component({
  selector: 'app-request-new',
  templateUrl: './request-new.component.html',
  styleUrls: ['./request-new.component.scss'],
})
export class RequestNewComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  @Input() requestFormGroup: FormGroup;
  @Input() formMode: FORM_TYPES = FORM_TYPES.CREATE_FORM;
  @Input() set requestInput(requestDetail: Request) {
    if (requestDetail) {
      let id: number = 0;
      requestDetail.VehicleDriver.forEach(elem => {
        elem.Id = id;
        id++;
      });
      this._detaultRequestValues = copyDeepObject(requestDetail);
      this.vehicleDriver = requestDetail.VehicleDriver;
      this.disabled = this.requestFormGroup.disabled;
    }
  }
  public vehicleDriver: VehicleDriver[] = [];
  public TOOLTIPS = TOOLTIPS;
  public dateToday: Date = new Date();
  public minDate: Date = this.dateToday;
  public edit: boolean = false;
  public disabled: boolean = false;
  public title: string = '';
  public submitButton: string = '';
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _detaultRequestValues: Request;

  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestsService,
    private loadingService: LoadingService,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private formValidatorService: FormValidatorService,
    private permissionService: PermissionService,
  ) {}

  public ngOnInit() {
    this.permissionService.checkAndRedirect([PERMISSIONS.REQUEST.CREATE]);
    if (this.formMode === FORM_TYPES.CREATE_FORM) {
      this.title = FORM_TITLES.CREATE;
      this.submitButton = FORM_BUTTONS.CONFIRM;
      this.loadForm();
      this.startDateListener();
    } else if (this.formMode === FORM_TYPES.EDIT_FORM) {
      this.title = FORM_TITLES.EDIT;
      this.submitButton = FORM_BUTTONS.REFRESH;
      this.edit = true;
    }
  }

  public ngAfterViewInit() {
    this.stepper._getIndicatorType = () => STEP_STATE.NUMBER;
  }

  public setAsociationsForm(list: VehicleDriver[]): void {
    if (list) {
      this.vehicleDriver = list;
      let activesArr: VehicleDriver[] = this.vehicleDriver.filter(association => association.Active);
      this.requestFormGroup
        .get('requestState')
        .setValue(
          activesArr.length > 0 || this.vehicleDriver.length === 0
            ? getRequestStateByKey('VALID').id
            : getRequestStateByKey('CANCELED').id,
        );
    }
  }

  public sumitStep1(): void {
    if (this.requestFormGroup.valid || this.requestFormGroup.disabled) {
      this.stepper.selected.completed = true;
      this.stepper.next();
    } else {
      this.formValidatorService.trigger$.next({
        id: 'REQUEST_DATA',
        formGroup: this.requestFormGroup,
        response: true,
      } as IFormValidator);
      this.requestFormGroup.markAllAsTouched();
    }
  }

  public sumitStep2(): void {
    if (this.hasAlmostOneAssociation()) {
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
  }

  public onSubmit(): void {
    if (this.isFormValid()) {
      if (this.formMode === FORM_TYPES.CREATE_FORM) this.onCreate();
      else this.onUpdate();
    }
  }

  private hasAlmostOneAssociation(): boolean {
    if (this.vehicleDriver.length !== 0) return true;

    this.notificationService.snack$.next({
      message: 'SNACK.REQUEST.FORM.VEHICLE_DRIVER_MIN',
      action: 'SNACK.ACTIONS.OK',
      class: SNACK_CLASS.ERROR,
    } as SnackModelEmitter);
    return false;
  }
  private isFormValid(): boolean {
    if (this.requestFormGroup.valid) {
      if (this.hasAlmostOneAssociation()) return true;
      return false;
    }
    return false;
  }

  public navigateRequestList = (): Promise<boolean> => this.router.navigate([APP_URLS.REQUESTS_LIST.path]);

  private onCreate(): void {
    openDialog(
      this.dialog,
      ModalActionType.YesCancel,
      'MODAL.TITLE.INFORMATION',
      'REQUEST_NEW.REQUEST_BASIC_DATA.MODAL.CREATE_REQUEST',
    )
      .afterClosed()
      .subscribe((data: ModalDialogResult) => {
        if (data && data.buttonId == ModalResponse.Ok) {
          this.loadingService.showLoading();
          this.requestService
            .addRequest(this.getRequest())
            .pipe(finalize(() => this.loadingService.hideLoading()))
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe(ids => {
              const error = ids as ErrorResponse;
              if (error && error.Error) {
                openErrorSnack(this.notificationService);
              } else {
                setTimeout(() => {
                  this.notificationService.snack$.next({
                    message: 'SNACK.SUCCESS',
                    action: 'SNACK.ACTIONS.OK',
                    class: SNACK_CLASS.SUCCESS,
                  } as SnackModelEmitter);
                  this.navigateRequestList();
                }, 500);
              }
            });
        }
      });
  }

  private onUpdate(): void {
    openDialog(
      this.dialog,
      ModalActionType.YesCancel,
      'MODAL.TITLE.INFORMATION',
      'REQUEST_NEW.REQUEST_BASIC_DATA.MODAL.UPDATE_REQUEST',
    )
      .afterClosed()
      .subscribe((data: ModalDialogResult) => {
        if (data && data.buttonId == ModalResponse.Ok) {
          this.loadingService.showLoading();
          this.requestService
            .updateRequest(this._detaultRequestValues.NumRequest, this.getRequestChanges())
            .pipe(finalize(() => this.loadingService.hideLoading()))
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe(ids => {
              const error = ids as ErrorResponse;
              if (error && error.Error) {
                openErrorSnack(this.notificationService);
              } else {
                setTimeout(() => {
                  this.navigateRequestList();
                  this.notificationService.snack$.next({
                    message: 'SNACK.SUCCESS',
                    action: 'SNACK.ACTIONS.OK',
                    class: SNACK_CLASS.SUCCESS,
                  } as SnackModelEmitter);
                }, 500);
              }
            });
        }
      });
  }

  private getRequest(): Request {
    const startDate: Date = this.requestFormGroup.get('validityStart').value;
    startDate.setHours(12, 0, 0);
    const endDate: Date = this.requestFormGroup.get('validityEnd').value;
    endDate.setHours(12, 0, 0);
    return {
      ValidityStart: startDate,
      ValidityEnd: endDate,
      ValidityStartHour: this.requestFormGroup.get('validityStartHour').value,
      ValidityEndHour: this.requestFormGroup.get('validityEndHour').value,
      Product: this.requestFormGroup.get('product').value,
      Format: this.requestFormGroup.get('format').value,
      NumAgreement: this.requestFormGroup.get('numAgreement').value,
      OC: this.requestFormGroup.get('OC').value,
      NumAgris: this.requestFormGroup.get('numAgris').value,
      DestinyClient: this.requestFormGroup.get('destinyClient').value,
      VehicleDriver: this.vehicleDriver,
      DestinyDirection: this.requestFormGroup.get('destinyDirection').value,
      IndustrialShed: this.requestFormGroup.get('industrialShed').value,
    } as Request;
  }

  private getRequestChanges() {
    let request: Request = {};

    const validityStartF = this.requestFormGroup.get('validityStart');
    let startDate: Date = validityStartF.value;
    startDate.setHours(12, 0, 0);

    const validityEndF = this.requestFormGroup.get('validityEnd');
    let endDate: Date = validityEndF.value;
    endDate.setHours(12, 0, 0);

    if (validityStartF.dirty || this.requestFormGroup.get('validityStartHour').dirty) {
      request.ValidityStart = startDate;
      request.ValidityStartHour = this.requestFormGroup.get('validityStartHour').value;
    }

    if (validityEndF.dirty || this.requestFormGroup.get('validityEndHour').dirty) {
      request.ValidityEnd = endDate;
      request.ValidityEndHour = this.requestFormGroup.get('validityEndHour').value;
    }

    if (this.requestFormGroup.get('product').dirty) request.Product = this.requestFormGroup.get('product').value;

    if (this.requestFormGroup.get('format').dirty) request.Format = this.requestFormGroup.get('format').value;

    if (this.requestFormGroup.get('numAgreement').dirty)
      request.NumAgreement = this.requestFormGroup.get('numAgreement').value;

    const requestState = this.requestFormGroup.get('requestState');
    if (requestState.dirty) request.Active = !isCanceledState(requestState.value);

    if (this.requestFormGroup.get('OC').dirty) request.OC = this.requestFormGroup.get('OC').value;

    if (this.requestFormGroup.get('numAgris').dirty) request.NumAgris = this.requestFormGroup.get('numAgris').value;

    if (this.requestFormGroup.get('destinyClient').dirty)
      request.DestinyClient = this.requestFormGroup.get('destinyClient').value;

    if (this.requestFormGroup.get('destinyDirection').dirty)
      request.DestinyDirection = this.requestFormGroup.get('destinyDirection').value;

    if (this.requestFormGroup.get('industrialShed').dirty)
      request.IndustrialShed = this.requestFormGroup.get('industrialShed').value;

    let newRequests: VehicleDriver[] = [];
    let modifiedRequests: VehicleDriver[] = [];
    this.vehicleDriver.forEach(association => {
      let tmp: VehicleDriver = this._detaultRequestValues.VehicleDriver.find(
        original => original.IdRequest === association.IdRequest,
      );

      if (tmp) {
        if (tmp.Active !== association.Active) modifiedRequests.push(association);
      } else newRequests.push(association);
    });

    if (newRequests.length > 0) request.VehicleDriverCreated = newRequests;

    if (modifiedRequests.length > 0) request.VehicleDriverModified = modifiedRequests;
    return request;
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
        requestState: ['', Validators.required],
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

  private startDateListener(): void {
    this.requestFormGroup
      .get('validityStart')
      .valueChanges.pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((data: Date) => {
        if (data) {
          let endDate: Date = this.requestFormGroup.get('validityEnd').value;
          if (endDate < data) {
            this.minDate = data;
            this.requestFormGroup.get('validityEnd').setValue(data);
          }
        }
      });
  }
}
