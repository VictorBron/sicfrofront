import { MatStepper } from '@angular/material/stepper';
import { Component, EventEmitter, OnInit, ViewChild, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { finalize, takeUntil } from 'rxjs/operators';
import { RequestParams } from '../../../../shared/models/request-params.model';
import { LoadingService, NotificationService } from '../../../../shared/services';
import { Driver } from '../../../drivers/models/driver.model';
import { Vehicle } from '../../../vehicles/models';
import { VehicleDriver } from '../../models/vehicle-driver.model';
import { TOOLTIPS, SNACK_CLASS, getTextByError } from '../../../../shared/constants';
import { VehiclesService } from './../../../vehicles/services/vehicles.service';
import { DriversService } from './../../../drivers/services/drivers.service';
import { Status } from '../../models';
import { ErrorResponse, SnackModelEmitter } from '../../../../shared/models';

@Component({
  selector: 'app-vehicle-driver',
  templateUrl: './vehicle-driver.component.html',
  styleUrls: ['./vehicle-driver.component.scss'],
})
export class VehicleDriverComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('matSelectDriver') matSelectDriver: MatSelect;
  @ViewChild('matSelectVehicle') matSelectVehicle: MatSelect;
  @Input() set vehicleDriverInput(newValue: VehicleDriver[]) {
    this.asociations = newValue;
    this._indexAssociations = newValue.length;
    this.notifyChange();
  }
  @Input() disabled: boolean = false;
  @Input() edit: boolean = false;
  @Output() asociationDataCallback = new EventEmitter<VehicleDriver[]>();

  public asociations: VehicleDriver[] = [];
  public formGroup: FormGroup;
  public listDriver: Driver[] = this.getDefaultDriver();
  public listVehicle: Vehicle[] = this.getDefaultVehicle();
  public selectedDriver: Driver;
  public selectedVehicle: Vehicle;
  public TOOLTIPS = TOOLTIPS;
  public tableData$ = new BehaviorSubject<VehicleDriver[]>(null);
  // States
  public showCreateDriver: boolean = false;
  public showCreateVehicle: boolean = false;
  // Subject
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _indexAssociations: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private driversService: DriversService,
    private vehiclesService: VehiclesService,
    private notificationService: NotificationService,
  ) {}

  public ngOnInit() {
    this.loadForm();
  }

  public searchDriver(id?: number): void {
    if (this.disabled) return;
    this.formGroup.get('valueSearchDriver').markAsDirty();

    if (!this.formGroup.get('valueSearchDriver').valid) return;
    this.loadingService.showLoading();
    this.driversService
      .getDriversByRUT({
        RUT: this.formGroup.get('valueSearchDriver').value,
      } as RequestParams)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(drivers => {
        const error = drivers as ErrorResponse;
        if (error && error.Error) {
        } else {
          const tmpDrivers = drivers as Driver[];
          this.listDriver = tmpDrivers;
          if (id) {
            this.selectFromListDriver(id);
            this.formGroup.get('selectDriver').setValue(id);
          } else {
            this.matSelectDriver.focus();
            this.matSelectDriver.open();
            if (this.listDriver.length === 1) {
              this.formGroup.get('selectDriver').setValue(this.listDriver[0].IdDriver);
              this.selectedDriver = this.listDriver[0];
              this.matSelectDriver.close();
            }
          }
        }
      });
  }

  public searchVehicle(id?: number): void {
    if (this.disabled) return;
    this.formGroup.get('valueSearchVehicle').markAsDirty();
    if (!this.formGroup.get('valueSearchVehicle').valid) return;
    this.loadingService.showLoading();
    this.vehiclesService
      .getVehiclesByPatent({
        Patent: this.formGroup.get('valueSearchVehicle').value,
      } as RequestParams)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(vehicles => {
        const error = vehicles as ErrorResponse;
        if (error && error.Error) {
        } else {
          const tmpVehicles = vehicles as Vehicle[];
          this.listVehicle = tmpVehicles;
          if (id) {
            this.selectFromListVehicle(id);
            this.formGroup.get('selectVehicle').setValue(id);
          } else {
            this.matSelectVehicle.focus();
            this.matSelectVehicle.open();
            if (this.listVehicle.length === 1) {
              this.formGroup.get('selectVehicle').setValue(this.listVehicle[0].IdVehicle);
              this.selectedVehicle = this.listVehicle[0];
              this.matSelectVehicle.close();
            }
          }
        }
      });
  }

  public onSelectionChangeDriver(driver: Driver, event: any): void {
    if (event.isUserInput && driver.IdDriver != -1) this.selectDriver(driver);
  }

  private selectDriver(driver: Driver): void {
    this.selectedDriver = driver;
    this.selectFromListDriver(driver.IdDriver);
  }

  public onSelectionChangeVehicle(vehicle: Vehicle, event: any): void {
    if (event.isUserInput && vehicle.IdVehicle != -1) this.selectVehicle(vehicle);
  }

  public getTextByKey(key: string): string {
    return this.formGroup.get(key).dirty ? getTextByError(this.formGroup.get(key).errors) : '';
  }

  private selectVehicle(vehicle: Vehicle): void {
    this.selectFromListVehicle(vehicle.IdVehicle);
    this.selectedVehicle = vehicle;
  }

  public statusCreationDriver(value: boolean) {
    this.showCreateDriver = value;
  }

  public statusCreationVehicle(value: boolean) {
    this.showCreateVehicle = value;
  }

  private selectFromListDriver(id: number) {
    this.selectedDriver = this.listDriver.find(x => x.IdDriver == id);
  }

  private selectFromListVehicle(id: number) {
    this.selectedVehicle = this.listVehicle.find(x => x.IdVehicle == id);
  }

  public newCallbackDriver(driver: Driver) {
    this.statusCreationDriver(false);
    this.formGroup.get('valueSearchDriver').setValue(driver.RUT);
    this.searchDriver(driver.IdDriver);
  }

  public newCallbackVehicle(vehicle: Vehicle) {
    this.statusCreationVehicle(false);
    this.formGroup.get('valueSearchVehicle').setValue(vehicle.Patent);
    this.searchVehicle(vehicle.IdVehicle);
  }

  public statusDriverVehicle(status: Status) {
    this.asociations.filter(association => association.Id === status.Id)[0].Active = status.Active;
    this.notifyChange();
  }

  public removeDriverVehicle(id: number) {
    this.asociations = this.asociations.filter(association => association.Id !== id);
    this.notifyChange();
  }

  public addDriverVehicle(): void {
    if (!this.selectedDriver) {
      this.showSnack('SNACK.REQUEST.FORM.SELECT_DRIVER', '');
      return;
    }

    if (!this.selectedVehicle) {
      this.showSnack('SNACK.REQUEST.FORM.SELECT_VEHICLE', '');
      return;
    }

    if (!this.checkDispon()) return;
    else {
      this.asociations.push({
        Id: this._indexAssociations,
        Vehicle: this.selectedVehicle,
        Driver: this.selectedDriver,
        Active: true,
      } as VehicleDriver);
      this.notifyChange();
      this.clear();
    }
  }

  private checkDispon(): boolean {
    const checkDriver = this.asociations.filter(driver => driver.Driver.IdDriver === this.selectedDriver.IdDriver);
    if (checkDriver && checkDriver.some(driver => driver.Active !== false)) {
      this.showSnack('SNACK.REQUEST.FORM.SELECT_VALID_DRIVER', '');
      return false;
    }

    const checkVehicle = this.asociations.filter(
      vehicle => vehicle.Vehicle.IdVehicle === this.selectedVehicle.IdVehicle,
    );
    if (checkVehicle && checkVehicle.some(vehicle => vehicle.Active !== false)) {
      this.showSnack('SNACK.REQUEST.FORM.SELECT_VALID_VEHICLE', '');
      return false;
    }

    return true;
  }

  private showSnack(message: string, action: string) {
    this.notificationService.snack$.next({
      message: message,
      action: 'SNACK.ACTIONS.OK',
      class: SNACK_CLASS.ERROR,
    } as SnackModelEmitter);
  }

  private clear(): void {
    this._indexAssociations++;
    this.statusCreationVehicle(false);
    this.statusCreationDriver(false);
    this.loadForm();
    this.selectedDriver = null;
    this.selectedVehicle = null;
    this.listDriver = this.getDefaultDriver();
    this.listVehicle = this.getDefaultVehicle();
  }

  private notifyChange(): void {
    this.tableData$.next(this.asociations);
    this.asociationDataCallback.next(this.asociations);
  }

  private loadForm(): void {
    this.formGroup = this.formBuilder.group({
      valueSearchDriver: ['', Validators.required],
      selectDriver: [''],
      valueSearchVehicle: ['', Validators.required],
      selectVehicle: [''],
    });
  }

  private getDefaultDriver(): Driver[] {
    return [{ Name: '-', IdDriver: -1 }] as Driver[];
  }
  private getDefaultVehicle(): Vehicle[] {
    return [{ Patent: '-', IdVehicle: -1, VehicleType: { Name: '-', IdVehicleType: -1 } }] as Vehicle[];
  }
}
