import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { LoadingService, NotificationService, PermissionService } from '../../../../shared/services';
import { getTimeString, validatorHourEnd, validatorHourStart } from '../../../../shared/utils';
import {
  SNACK_CLASS,
  APP_URLS,
  FORM_TYPES,
  getTextByError,
  ERROR_HTTP_KEYS,
  itemNotInDb,
  openErrorSnack,
  PERMISSIONS,
} from '../../../../shared/constants';
import { ErrorResponse, SnackModelEmitter } from '../../../../shared/models';
import { Client } from '../../../clients/models/index';
import { ClientsService } from '../../../clients/services/clients.service';
import { FORM_TITLES } from '../../constants';
import { Schedule } from '../../models';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss'],
})
export class ScheduleFormComponent implements OnInit {
  @Input() formMode: FORM_TYPES = FORM_TYPES.CREATE_FORM;
  public scheduleForm: FormGroup = null;
  public title: string = FORM_TITLES.CREATE;
  public formTypes = FORM_TYPES;
  public clients: Client[] = [];
  public dateToday: Date = new Date();
  public minDate: Date = this.dateToday;
  private idSchedule: number = null;
  private formDisabled = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private scheduleService: ScheduleService,
    private clientService: ClientsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.permissionService.checkAndRedirect([PERMISSIONS.SCHEDULE.UPDATE]);
    if (this.formMode === FORM_TYPES.DETAIL_FORM || this.formMode === FORM_TYPES.EDIT_FORM) {
      this.idSchedule = this.activatedRoute.snapshot.params.id;
      this.title = FORM_TITLES.EDIT;
      if (this.formMode === FORM_TYPES.DETAIL_FORM) {
        this.formDisabled = true;
        this.title = FORM_TITLES.DETAIL;
      }
    }
    this.initForm();
    this.startDateListener();
  }

  public onGoBackButtonClick(): void {
    this.router.navigate([APP_URLS.SCHEDULES_LIST.path]);
  }

  public onEditButtonClick(): void {
    if (this.scheduleForm.errors || this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      this.showSnack('SCHEDULES.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.formMode = FORM_TYPES.EDIT_FORM;
    this.title = FORM_TITLES.EDIT;
    this.scheduleForm.enable();
  }

  public onSaveButtonClick(): void {
    if (this.scheduleForm.errors || this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      this.showSnack('SCHEDULES.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    if (this.formMode === FORM_TYPES.CREATE_FORM) {
      this.createSchedule();
    } else if (this.formMode === FORM_TYPES.EDIT_FORM) {
      this.editSchedule();
    }
  }

  public checkHourRange() {
    const form = this.scheduleForm.controls;
    const hFrom = form['HourFrom'].value;
    const hTo = form['HourTo'].value;
    let valid = false;
    if (hFrom && hTo) {
      valid = hFrom < hTo;
    }

    return valid;
  }

  public getTextByKey = (key: string): string =>
    this.scheduleForm.get(key).dirty ? getTextByError(this.scheduleForm.get(key).errors) : '';

  private startDateListener(): void {
    this.scheduleForm
      .get('DayFrom')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: Date) => {
        if (data) {
          let endDate: Date = this.scheduleForm.get('DayTo').value;
          if (endDate < data) {
            this.minDate = data;
            this.scheduleForm.get('DayTo').setValue(data);
          }
        }
      });
  }

  private initForm(): void {
    this.scheduleForm = this.formBuilder.group(
      {
        Client: [{ value: '', disabled: this.formDisabled }, Validators.required],
        DayFrom: [{ value: this.dateToday, disabled: this.formDisabled }, Validators.required],
        DayTo: [{ value: this.dateToday, disabled: this.formDisabled }, Validators.required],
        HourFrom: [{ value: '', disabled: this.formDisabled }, Validators.required],
        HourTo: [{ value: '', disabled: this.formDisabled }, Validators.required],
        Comment: [{ value: '', disabled: this.formDisabled }],
      },
      {
        validator: [validatorHourStart('HourFrom', 'HourTo'), validatorHourEnd('HourFrom', 'HourTo')],
      },
    );
    this.getClients();
    if (this.formMode !== FORM_TYPES.CREATE_FORM) {
      this.setFormValues();
    }
  }

  private getClients(): void {
    this.loadingService.showLoading();
    this.clientService
      .getAllClients()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(clients => {
        if (!clients) {
          this.showSnack('SCHEDULES.SNACK.CLIENTS_ERROR', SNACK_CLASS.ERROR);
        } else {
          this.clients = clients;
        }
      });
  }

  private createSchedule(): void {
    if (!this.checkHourRange()) {
      this.showSnack('SCHEDULES.SNACK.HOUR_RANGE_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.loadingService.showLoading();
    this.scheduleService
      .createSchedule(this.getScheduleFromForm())
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schedule => {
        const error = schedule as ErrorResponse;
        if (!schedule || !schedule.IdSchedule || error.Error) {
          this.showSnack('SCHEDULES.SNACK.CREATE_ERROR', SNACK_CLASS.ERROR);
        } else {
          this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
          this.router.navigate([APP_URLS.SCHEDULES_LIST]);
        }
      });
  }

  private editSchedule(): void {
    if (!this.checkHourRange()) {
      this.showSnack('SCHEDULES.SNACK.HOUR_RANGE_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.loadingService.showLoading();
    this.scheduleService
      .editSchedule(this.getEditedFields())
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schedule => {
        const error = schedule as ErrorResponse;
        if (!schedule || !schedule.IdSchedule || error.Error) {
          this.showSnack('SCHEDULES.SNACK.EDIT_ERROR', SNACK_CLASS.SUCCESS);
        } else {
          this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
          this.router.navigate([APP_URLS.SCHEDULES_LIST.path]);
        }
      });
  }

  private setFormValues(): void {
    this.loadingService.showLoading();
    this.scheduleService
      .getScheduleById(this.idSchedule)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schedule => {
        const error: ErrorResponse = schedule as ErrorResponse;
        if (error && error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.ITEM_NOT_IN_DB)
            itemNotInDb(this.notificationService, this.router, [APP_URLS.SCHEDULES_LIST.path]);
          else openErrorSnack(this.notificationService);
        }
        if (schedule) {
          this.scheduleForm.patchValue({
            DayFrom: new Date(schedule.DayFrom),
            DayTo: new Date(schedule.DayTo),
            Client: schedule.Client?.IdClient ? schedule.Client.IdClient : -1,
            Comment: schedule?.Comment ? schedule.Comment : '',
            HourFrom: getTimeString(schedule.HourFrom),
            HourTo: getTimeString(schedule.HourTo),
          });
        } else {
          this.showSnack('SCHEDULES.SNACK.GET_SCHEDULE_ERROR', SNACK_CLASS.ERROR);
        }
      });
  }

  private getScheduleFromForm(): Schedule {
    const form = this.scheduleForm.controls;
    return {
      Client: { IdClient: form['Client'].value },
      DayFrom: form['DayFrom'].value,
      DayTo: form['DayTo'].value,
      Comment: form['Comment'].value,
      HourFromString: form['HourFrom'].value,
      HourToString: form['HourTo'].value,
    };
  }

  private getEditedFields(): Schedule {
    let schedule: Schedule = {};
    schedule.IdSchedule = this.idSchedule;
    const form = this.scheduleForm.controls;
    if (form['Client'].dirty) {
      schedule.Client = { IdClient: form['Client'].value };
    }

    if (form['DayFrom'].dirty) {
      schedule.DayFrom = form['DayFrom'].value;
    }
    if (form['DayTo'].dirty) {
      schedule.DayTo = form['DayTo'].value;
    }

    if (form['HourFrom'].dirty) {
      schedule.HourFromString = form['HourFrom'].value;
    }
    if (form['HourTo'].dirty) {
      schedule.HourToString = form['HourTo'].value;
    }

    if (form['Comment'].dirty) {
      schedule.Comment = form['Comment'].value;
    }
    return schedule;
  }

  private showSnack(message: string, _class: string) {
    this.notificationService.snack$.next({
      message: this.translate.instant(message),
      action: 'SNACK.ACTIONS.OK',
      class: _class,
    } as SnackModelEmitter);
  }
}
