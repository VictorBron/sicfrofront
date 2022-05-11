import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Driver } from '../../../drivers/models';
import { DriversService } from '../../../drivers';
import { ErrorResponse, IFormValidator, RequestParams, SnackModelEmitter } from '../../../../shared/models';
import { validatorCheckRUT } from '../../../../shared/utils';
import { FormValidatorService, NotificationService, LoadingService } from '../../../../shared/services';
import { getTextByError, SNACK_CLASS, ERROR_HTTP_KEYS } from '../../../../shared/constants';

@Component({
  selector: 'app-driver-data',
  templateUrl: './driver-data.component.html',
  styleUrls: ['./driver-data.component.scss'],
})
export class DriverDataComponent implements OnInit {
  @Output() newDriver = new EventEmitter<Driver>();
  @Output() cancel = new EventEmitter();
  public formGroup: FormGroup;

  // Subject
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private driversService: DriversService,
    private formValidatorService: FormValidatorService,
    private notificationService: NotificationService,
  ) {}

  public ngOnInit() {
    this.formGroup = this.formBuilder.group(
      {
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        rut: ['', Validators.required],
        telephone: ['', Validators.required],
        email: ['', Validators.email],
      },
      {
        validator: validatorCheckRUT('rut'),
      },
    );
  }

  public submitCancel = (): void => this.cancel.emit();

  public submitNewDriver(): void {
    if (this.isFormValid()) this.createDriver();
    else
      this.notificationService.snack$.next({
        message: 'DRIVERS.SNACK.FORM_ERROR',
        action: 'SNACK.ACTIONS.OK',
        class: SNACK_CLASS.ERROR,
      } as SnackModelEmitter);
  }

  public getTextByKey = (key: string): string =>
    this.formGroup.get(key).dirty ? getTextByError(this.formGroup.get(key).errors) : '';

  private createDriver(): void {
    this.loadingService.showLoading();

    const driver: Driver = {
      Name: this.formGroup.get('name').value,
      LastName: this.formGroup.get('lastName').value,
      RUT: this.formGroup.get('rut').value,
      Telephone: this.formGroup.get('telephone').value,
      Email: this.formGroup.get('email').value,
    };

    this.driversService
      .addDriver({
        driver,
      } as RequestParams)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(driver => {
        const error = driver as ErrorResponse;
        if (error && error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.REPEATED_RUT ? `DRIVERS.SNACK.REPEATED_RUT` : 'DRIVERS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else {
          const tmpDriver = driver as Driver;
          if (tmpDriver !== null && tmpDriver.IdDriver !== null) {
            this.newDriver.emit(tmpDriver);
          }
        }
      });
  }

  private isFormValid(): boolean {
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formValidatorService.trigger$.next({
        id: 'DRIVER_DATA',
        formGroup: this.formGroup,
      } as IFormValidator);
    }
    return false;
  }

  private showSnack(message: string, _class: string) {
    this.notificationService.snack$.next({
      message: message,
      action: 'SNACK.ACTIONS.OK',
      class: _class,
    } as SnackModelEmitter);
  }
}
