import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { VehicleDriver } from '../../models/vehicle-driver.model';
import { getDate } from '../../../../shared/utils/dates';
import { getRequestState, getRequestStateById, RequestState } from '../../constants';

@Component({
  selector: 'app-request-confirm',
  templateUrl: './request-confirm.component.html',
  styleUrls: ['./request-confirm.component.scss'],
})
export class RequestConfirmComponent {
  @Input() formGroup: FormGroup;
  @Input() associations: VehicleDriver[];

  public separator: string = ': ';
  constructor() {}

  public getDate(date: Date): string {
    return getDate(date).split(' ')[0];
  }

  public getHour(date: Date): string {
    return getDate(date).split(' ')[1];
  }

  public getRequestState(active: boolean): RequestState {
    return getRequestState(active);
  }

  public getRequestStateGlobal(id: number): string {
    return getRequestStateById(id).text;
  }
}
