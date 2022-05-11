import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  APP_URLS,
  FORM_TYPES,
  getTextByError,
  ERROR_HTTP_KEYS,
  SNACK_CLASS,
  itemNotInDb,
} from '../../../../shared/constants';
import { openErrorSnack } from '../../../../shared/constants/snack/snack-direct.constants';
import { ErrorResponse, RequestParams, SnackModelEmitter } from '../../../../shared/models';
import { LoadingService, NotificationService } from '../../../../shared/services';
import { validatorCheckRUT } from '../../../../shared/utils';
import { FORM_TITLES } from '../../../drivers/constants';
import { Driver } from '../../models';
import { DriversService } from '../../services';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss'],
})
export class DriverFormComponent implements OnInit {
  @Input()
  public formMode: FORM_TYPES = FORM_TYPES.CREATE_FORM;
  public title: string = FORM_TITLES.CREATE;
  public formTypes = FORM_TYPES;
  public driverForm: FormGroup = null;
  private idDriver: number = null;
  private driver: Driver = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private formDisabled = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private driverService: DriversService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    if (this.formMode === FORM_TYPES.DETAIL_FORM || this.formMode === FORM_TYPES.EDIT_FORM) {
      this.idDriver = this.activatedRoute.snapshot.params.id;
      this.title = FORM_TITLES.EDIT;
    }
    if (this.formMode === FORM_TYPES.DETAIL_FORM) {
      this.formDisabled = true;
      this.title = FORM_TITLES.DETAIL;
    }
    this.initForm();
  }

  public getTextByKey = (key: string): string =>
    this.driverForm.get(key).dirty ? getTextByError(this.driverForm.get(key).errors) : '';

  public onSaveButtonClick(): void {
    if (this.formMode === FORM_TYPES.CREATE_FORM) {
      this.createDriver();
    } else {
      this.updateDriver();
    }
  }

  public onGoBackButtonClick(): void {
    this.router.navigate([APP_URLS.DRIVERS_LIST]);
  }

  public onEditButtonClick(): void {
    this.formMode = FORM_TYPES.EDIT_FORM;
    this.driverForm.enable();
    this.title = FORM_TITLES.EDIT;
  }

  public onRemoveButtonClick(): void {
    this.loadingService.showLoading();
    this.driverService
      .deleteDriver(this.driver.IdDriver)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(driver => {
        const error = driver as ErrorResponse;
        if (!driver || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.KEY_ALREADY_USED
              ? `DRIVERS.SNACK.KEY_ALREADY_USED`
              : 'DRIVERS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else this.showSnackSuccess();
      });
  }

  private initForm(): void {
    this.driverForm = this.formBuilder.group(
      {
        rut: [{ value: '', disabled: this.formDisabled }, Validators.required],
        name: [{ value: '', disabled: this.formDisabled }, Validators.required],
        lastName: [{ value: '', disabled: this.formDisabled }, Validators.required],
        phone: [{ value: '', disabled: this.formDisabled }, Validators.required],
        email: [{ value: '', disabled: this.formDisabled }, Validators.email],
      },
      {
        validators: validatorCheckRUT('rut'),
      },
    );
    if (this.formMode === FORM_TYPES.EDIT_FORM || this.formMode === FORM_TYPES.DETAIL_FORM) {
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    this.loadingService.showLoading();
    this.driverService
      .getDriverById(this.idDriver)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(driver => {
        const error = driver as ErrorResponse;
        if (!driver || error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.ITEM_NOT_IN_DB)
            itemNotInDb(this.notificationService, this.router, [APP_URLS.DRIVERS_LIST.path]);
          else openErrorSnack(this.notificationService);
        } else {
          const tmpDriver = driver as Driver;
          this.driver = tmpDriver;
          this.driverForm.patchValue({
            rut: tmpDriver?.RUT ? tmpDriver.RUT : '',
            name: tmpDriver?.Name ? tmpDriver.Name : '',
            lastName: tmpDriver?.LastName ? tmpDriver.LastName : '',
            phone: tmpDriver?.Telephone ? tmpDriver.Telephone : '',
            email: tmpDriver?.Email ? tmpDriver.Email : '',
          });
        }
      });
  }

  private getDriverFromForm(): Driver {
    const controls = this.driverForm.controls;
    return {
      IdDriver: this.idDriver,
      RUT: controls['rut'].value,
      Name: controls['name'].value,
      LastName: controls['lastName'].value,
      Telephone: controls['phone'].value,
      Email: controls['email'].value,
    };
  }

  private getEditedFields(): Driver {
    const controls = this.driverForm.controls;
    let driver: Driver = { IdDriver: this.idDriver };
    if (controls['rut'].dirty && controls['rut'].value !== this.driver.RUT) {
      driver.RUT = controls['rut'].value;
    }
    if (controls['name'].dirty && controls['name'].value !== this.driver.Name) {
      driver.Name = controls['name'].value;
    }
    if (controls['lastName'].dirty && controls['lastName'].value !== this.driver.LastName) {
      driver.LastName = controls['lastName'].value;
    }
    if (controls['phone'].dirty && controls['phone'].value !== this.driver.Telephone) {
      driver.Telephone = controls['phone'].value;
    }
    if (controls['email'].dirty && controls['email'].value !== this.driver.Email) {
      driver.Email = controls['email'].value;
    }
    return driver;
  }
  private createDriver(): void {
    if (this.driverForm.errors || this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      this.showSnack('DRIVERS.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.loadingService.showLoading();
    const driver: Driver = this.getDriverFromForm();
    this.driverService
      .addDriver({
        driver,
      } as RequestParams)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(driver => {
        const error = driver as ErrorResponse;

        const tmpDriver = driver as Driver;
        if (!tmpDriver || !tmpDriver.IdDriver || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.REPEATED_RUT ? `DRIVERS.SNACK.REPEATED_RUT` : 'DRIVERS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else this.showSnackSuccess();
      });
  }

  private updateDriver(): void {
    if (this.driverForm.errors || this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      this.showSnack('DRIVERS.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.loadingService.showLoading();
    this.driverService
      .updateDriver(this.getEditedFields())
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(driver => {
        const error = driver as ErrorResponse;
        if (!driver || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.REPEATED_RUT
              ? `DRIVERS.SNACK.${error.Error}`
              : 'DRIVERS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else this.showSnackSuccess();
      });
  }

  private showSnack(message: string, _class: string) {
    this.notificationService.snack$.next({
      message: message,
      action: 'SNACK.ACTIONS.OK',
      class: _class,
    } as SnackModelEmitter);
  }

  private showSnackSuccess() {
    this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
    this.onGoBackButtonClick();
  }
}
