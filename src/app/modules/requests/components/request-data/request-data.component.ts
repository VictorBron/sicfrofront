import { takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormValidatorService } from '../../../../shared/services/form-validator/form-validator.service';
import { NotificationService } from '../../../../shared/services/notification-service/notification.service';
import { getTextByError } from '../../../../shared/constants/form-errors.constants';
import { IFormValidator, SnackModelEmitter } from '../../../../shared/models';
import { SNACK_CLASS } from '../../../../shared/constants';

@Component({
  selector: 'app-request-data',
  templateUrl: './request-data.component.html',
  styleUrls: ['./request-data.component.scss'],
})
export class RequestDataComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() edit: boolean = false;
  public dateToday: Date = new Date();
  public minDate: Date = this.dateToday;

  // Subject
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private formValidatorService: FormValidatorService, private notificationService: NotificationService) {
    /* EMPTY BLOCK */
  }

  public ngOnInit() {
    this.startDateListener();
    this.suscribeValidatorForm();
  }

  public getTextByKey(key: string): string {
    return this.formGroup.get(key).dirty ? getTextByError(this.formGroup.get(key).errors) : '';
  }

  private startDateListener(): void {
    this.formGroup
      .get('validityStart')
      .valueChanges.pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((data: Date) => {
        if (data) {
          let endDate: Date = this.formGroup.get('validityEnd').value;
          if (endDate < data) {
            this.minDate = data;
            this.formGroup.get('validityEnd').setValue(data);
          }
        }
      });
  }

  private suscribeValidatorForm(): void {
    this.formValidatorService.response$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((data: IFormValidator) => {
      if (data?.id === 'REQUEST_DATA' && data.haveErrors && data.notDisabled)
        this.showSnack('SNACK.REQUEST.FORM.CHECK_REQUEST_DATA');
    });
  }

  private showSnack(message: string) {
    this.notificationService.snack$.next({
      message: message,
      action: 'SNACK.ACTIONS.OK',
      class: SNACK_CLASS.ERROR,
    } as SnackModelEmitter);
  }
}
