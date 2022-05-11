import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  ERROR_HTTP_KEYS,
  getTextByError,
  APP_URLS,
  FORM_TYPES,
  SNACK_CLASS,
  itemNotInDb,
  openErrorSnack,
} from '../../../../shared/constants';
import { LoadingService, NotificationService } from '../../../../shared/services';
import { validatorCheckPatent } from '../../../../shared/utils';
import { ErrorResponse, RequestParams, SnackModelEmitter } from '../../../../shared/models';
import { FORM_TITLES } from '../../constants/vehicle-form-titles.constants';
import { Vehicle, VehicleType } from '../../models';
import { VehiclesService } from '../../services';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
})
export class VehicleFormComponent implements OnInit {
  @Input()
  public formMode: FORM_TYPES = FORM_TYPES.CREATE_FORM;
  public title: string = FORM_TITLES.CREATE;
  public formTypes = FORM_TYPES;
  public vehicleForm: FormGroup = null;
  public types: VehicleType[] = [];
  public formDisabled = false;
  private vehicle: Vehicle = null;
  private idVehicle: number;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private vehicleService: VehiclesService,
    private router: Router,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    if (this.formMode === FORM_TYPES.EDIT_FORM || this.formMode === FORM_TYPES.DETAIL_FORM) {
      this.idVehicle = this.activatedRoute.snapshot.params.id;
    }

    this.title =
      this.formMode === FORM_TYPES.CREATE_FORM
        ? FORM_TITLES.CREATE
        : this.formMode === FORM_TYPES.DETAIL_FORM
        ? FORM_TITLES.DETAIL
        : FORM_TITLES.EDIT;
    this.formDisabled = this.formMode === FORM_TYPES.DETAIL_FORM;
    this.initForm();
    this.fetchVehicleTypes();
  }

  public getTextByKey = (key: string): string =>
    this.vehicleForm.get(key).dirty ? getTextByError(this.vehicleForm.get(key).errors) : '';

  public onSaveButtonClick(): void {
    if (this.formMode === FORM_TYPES.CREATE_FORM) {
      this.createVehicle();
    } else {
      this.editVehicle();
    }
  }

  public onEditButtonClick(): void {
    this.formMode = FORM_TYPES.EDIT_FORM;
    this.title = FORM_TITLES.EDIT;
    this.vehicleForm.enable();
    this.formDisabled = false;
  }

  public onGoBackClick(): void {
    this.router.navigate([APP_URLS.VEHICLES_LIST.path]);
  }

  public onRemoveButtonClick(): void {
    this.loadingService.showLoading();
    this.vehicleService
      .deleteVehicle(this.vehicle.IdVehicle)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(driver => {
        const error = driver as ErrorResponse;
        if (!driver || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.KEY_ALREADY_USED
              ? `VEHICLES.SNACK.KEY_ALREADY_USED`
              : 'VEHICLES.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else this.showSnackSuccess();
      });
  }

  private createVehicle(): void {
    if (this.vehicleForm.invalid || this.vehicleForm.errors) {
      this.vehicleForm.markAllAsTouched();
      this.showSnack('VEHICLES.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }

    this.loadingService.showLoading();
    const vehicle: Vehicle = this.getVehicleFromForm();
    this.vehicleService
      .addVehicle({ vehicle } as RequestParams)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(vehicle => {
        const error = vehicle as ErrorResponse;
        const created = vehicle as Vehicle;
        if (!vehicle || !created.IdVehicle || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.REPEATED_PATENT
              ? 'VEHICLES.SNACK.REPEATED_PATENT'
              : 'VEHICLES.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else {
          this.showSnackSuccess();
        }
      });
  }

  public editVehicle(): void {
    if (this.vehicleForm.invalid || this.vehicleForm.errors) {
      this.vehicleForm.markAllAsTouched();
      this.showSnack('VEHICLES.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }

    this.loadingService.showLoading();
    this.vehicleService
      .editVehicle(this.getEditedFields())
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(vehicle => {
        const error = vehicle as ErrorResponse;
        if (!vehicle || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.REPEATED_PATENT
              ? 'VEHICLES.SNACK.REPEATED_PATENT'
              : 'VEHICLES.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else {
          this.showSnackSuccess();
        }
      });
  }

  private initForm(): void {
    this.vehicleForm = this.formBuilder.group(
      {
        patent: [{ value: '', disabled: this.formDisabled }, Validators.required],
        type: [{ value: '', disabled: this.formDisabled }, Validators.required],
        description: [{ value: '', disabled: this.formDisabled }],
      },
      { validators: validatorCheckPatent('patent') },
    );
    if (this.formMode === FORM_TYPES.DETAIL_FORM || this.formMode === FORM_TYPES.EDIT_FORM) {
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    this.vehicleService
      .getVehicleById(this.idVehicle)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(vehicles => {
        const error = vehicles as ErrorResponse;
        if (!vehicles || error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.ITEM_NOT_IN_DB)
            itemNotInDb(this.notificationService, this.router, [APP_URLS.VEHICLES_LIST.path]);
          else openErrorSnack(this.notificationService);
        } else {
          const vehicle = vehicles as Vehicle;
          this.vehicle = vehicle;
          this.vehicleForm.patchValue({
            patent: vehicle?.Patent ? vehicle.Patent : '',
            type: vehicle?.VehicleType.IdVehicleType ? vehicle.VehicleType.IdVehicleType : '',
            description: vehicle?.Description ? vehicle.Description : '',
            id: vehicle?.IdVehicle ? vehicle.IdVehicle : '',
          });
        }
      });
  }

  private getVehicleFromForm(): Vehicle {
    return {
      IdVehicle: this.idVehicle,
      Patent: this.vehicleForm.controls.patent.value,
      VehicleType: { IdVehicleType: this.vehicleForm.controls.type.value },
      Description: this.vehicleForm.controls.description.value,
    };
  }

  private getEditedFields(): Vehicle {
    const form = this.vehicleForm.controls;

    let vehicle: Vehicle = { IdVehicle: this.idVehicle };
    if (form.patent.dirty && this.vehicle.Patent.toUpperCase() !== form.patent.value.toUpperCase()) {
      vehicle.Patent = form.patent.value;
    }
    if (form.type.dirty && this.vehicle.VehicleType !== form.type.value) {
      if (!vehicle.VehicleType) vehicle.VehicleType = { IdVehicleType: form.type.value };
    }
    if (form.description.dirty && this.vehicle.Description !== form.description.value) {
      vehicle.Description = form.description.value;
    }
    return vehicle;
  }

  private fetchVehicleTypes(): void {
    this.loadingService.showLoading();
    this.vehicleService
      .getVehicleTypes()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(vehicleTypes => {
        const error = vehicleTypes as ErrorResponse;
        if (!vehicleTypes || error.Error) {
          this.showSnack(this.translate.instant('VEHICLES.SNACK.TYPES_ERROR'), SNACK_CLASS.ERROR);
        } else {
          const tmpVehicleType = vehicleTypes as VehicleType[];
          this.types = tmpVehicleType;
        }
      });
  }

  private showSnack(message: string, _class: string): void {
    this.notificationService.snack$.next({
      message: message,
      action: 'SNACK.ACTIONS.OK',
      class: _class,
    } as SnackModelEmitter);
  }

  private showSnackSuccess(): void {
    this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
    this.onGoBackClick();
  }
}
