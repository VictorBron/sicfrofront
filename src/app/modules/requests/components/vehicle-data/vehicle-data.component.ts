import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Vehicle } from './../../../vehicles/models/vehicle.model';
import { VehicleType } from '../../../vehicles/models';
import { VehiclesService } from './../../../vehicles/services/vehicles.service';
import { FormValidatorService, LoadingService, NotificationService } from '../../../../shared/services';
import { getTextByError, SNACK_CLASS, ERROR_HTTP_KEYS } from '../../../../shared/constants';
import { validatorCheckPatent } from '../../../../shared/utils';
import { RequestParams, ErrorResponse, IFormValidator, SnackModelEmitter } from '../../../../shared/models';

@Component({
  selector: 'app-vehicle-data',
  templateUrl: './vehicle-data.component.html',
  styleUrls: ['./vehicle-data.component.scss'],
})
export class VehicleDataComponent implements OnInit {
  @Output() newVehicle = new EventEmitter<Vehicle>();
  @Output() cancel = new EventEmitter();

  public formGroup: FormGroup;
  public vehicleTypes: VehicleType[] = [];

  // Subject
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private vehiclesService: VehiclesService,
    private formValidatorService: FormValidatorService,
    private notificationService: NotificationService,
  ) {}

  public ngOnInit() {
    this.formGroup = this.formBuilder.group(
      {
        patent: ['', Validators.required],
        type: ['', Validators.required],
        description: [''],
      },
      {
        validator: validatorCheckPatent('patent'),
      },
    );
    this.fetchVehicleTypes();
  }

  public submitCancel = (): void => this.cancel.emit();

  public submitNewVehicle(): void {
    if (this.isFormValid()) this.addVehicle();
    else
      this.notificationService.snack$.next({
        message: 'VEHICLES.SNACK.FORM_ERROR',
        action: 'SNACK.ACTIONS.OK',
        class: SNACK_CLASS.ERROR,
      } as SnackModelEmitter);
  }

  public getTextByKey = (key: string): string =>
    this.formGroup.get(key).dirty ? getTextByError(this.formGroup.get(key).errors) : '';

  public addVehicle() {
    this.loadingService.showLoading();

    const vehicle: Vehicle = {
      Patent: this.formGroup.get('patent').value,
      VehicleType: this.formGroup.get('type').value,
      Description: this.formGroup.get('description').value,
    };

    this.vehiclesService
      .addVehicle({
        vehicle,
      } as RequestParams)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(vehicle => {
        const error = vehicle as ErrorResponse;
        if (error && error.Error) {
          if (error && error.Error) {
            this.showSnack(
              error.Error === ERROR_HTTP_KEYS.REPEATED_PATENT
                ? 'VEHICLES.SNACK.REPEATED_PATENT'
                : 'VEHICLES.SNACK.UNKNOWN_ERROR',
              SNACK_CLASS.ERROR,
            );
          }
        } else {
          const tmpVehicle = vehicle as Vehicle;
          if (tmpVehicle !== null && tmpVehicle.IdVehicle !== null) {
            this.newVehicle.emit(tmpVehicle);
          }
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

  private isFormValid(): boolean {
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formValidatorService.trigger$.next({
        id: 'VEHICLE_DATA',
        formGroup: this.formGroup,
      } as IFormValidator);
    }
    return false;
  }

  private fetchVehicleTypes(): void {
    this.loadingService.showLoading();
    this.vehiclesService
      .getVehicleTypes()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(vehicleTypes => {
        const error = vehicleTypes as ErrorResponse;
        if (error && error.Error) {
        } else {
          const tmpVehicles = vehicleTypes as VehicleType[];
          this.vehicleTypes = tmpVehicles;
        }
      });
  }
}
