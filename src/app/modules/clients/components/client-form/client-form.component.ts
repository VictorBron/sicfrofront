import { itemNotInDb } from './../../../../shared/constants/errors/error-http-handlers';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { FORM_TITLES } from '../../constants';
import { Client } from '../../models';
import { ClientsService } from '../../services';
import { validatorCheckRUT } from './../../../../shared/utils';
import { SNACK_CLASS, getTextByError, APP_URLS, FORM_TYPES, ERROR_HTTP_KEYS } from './../../../../shared/constants';
import { SnackModelEmitter, ErrorResponse } from './../../../../shared/models';
import { LoadingService, NotificationService } from './../../../../shared/services';
import { openErrorSnack } from '../../../../shared/constants/snack/snack-direct.constants';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements OnInit {
  @Input() formMode: FORM_TYPES = FORM_TYPES.CREATE_FORM;
  public clientForm: FormGroup = null;
  public idClient: number = null;
  public title: string = FORM_TITLES.CREATE;
  public formTypes = FORM_TYPES;
  private client: Client = null;
  private formDisabled = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private loadingService: LoadingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    if (this.formMode === FORM_TYPES.DETAIL_FORM || this.formMode === FORM_TYPES.EDIT_FORM) {
      this.idClient = this.activatedRoute.snapshot.params.id;
      this.title = FORM_TITLES.EDIT;
    }
    if (this.formMode === FORM_TYPES.DETAIL_FORM) {
      this.formDisabled = true;
      this.title = FORM_TITLES.DETAIL;
    }
    this.initForm();
  }

  public onSaveButtonClick(): void {
    if (this.formMode === FORM_TYPES.CREATE_FORM) {
      this.createClient();
    } else {
      this.updateClient();
    }
  }

  public onEditButtonClick(): void {
    this.formMode = FORM_TYPES.EDIT_FORM;
    this.clientForm.enable();
    this.title = FORM_TITLES.EDIT;
  }

  public onGoBackButtonClick(): void {
    this.router.navigate([APP_URLS.CLIENTS_LIST.path]);
  }

  public getTextByKey = (key: string): string =>
    this.clientForm.get(key).dirty ? getTextByError(this.clientForm.get(key).errors) : '';

  public onRemoveButtonClick(): void {
    this.loadingService.showLoading();
    this.clientService
      .deleteClient(this.client.IdClient)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(client => {
        const error = client as ErrorResponse;
        if (!client || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.KEY_ALREADY_USED
              ? `CLIENTS.SNACK.KEY_ALREADY_USED`
              : 'CLIENTS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else this.showSnackSuccess();
      });
  }

  private initForm(): void {
    this.clientForm = this.formBuilder.group(
      {
        RUT: [{ value: '', disabled: this.formDisabled }, Validators.required],
        OT: [{ value: '', disabled: this.formDisabled }, Validators.required],
        Name: [{ value: '', disabled: this.formDisabled }, Validators.required],
        Giro: [{ value: '', disabled: this.formDisabled }, Validators.required],
        Direction: [{ value: '', disabled: this.formDisabled }, Validators.required],
        City: [{ value: '', disabled: this.formDisabled }, Validators.required],
        Telephone: [{ value: '', disabled: this.formDisabled }, Validators.required],
        Email: [{ value: '', disabled: this.formDisabled }, Validators.email],
      },
      {
        validators: validatorCheckRUT('RUT'),
      },
    );
    if (this.formMode === FORM_TYPES.DETAIL_FORM || this.formMode === FORM_TYPES.EDIT_FORM) {
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    this.loadingService.showLoading();
    this.clientService
      .getClientById(this.idClient)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(client => {
        const error = client as ErrorResponse;
        if (error && error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.ITEM_NOT_IN_DB)
            itemNotInDb(this.notificationService, this.router, [APP_URLS.CLIENTS_LIST.path]);
          else openErrorSnack(this.notificationService);
        } else {
          const tmpClient = client as Client;
          this.client = tmpClient;
          this.clientForm.patchValue({
            RUT: tmpClient?.RUT ? tmpClient.RUT : '',
            OT: tmpClient?.OT ? tmpClient.OT : '',
            Name: tmpClient?.Name ? tmpClient.Name : '',
            Giro: tmpClient?.Giro ? tmpClient.Giro : '',
            Direction: tmpClient?.Direction ? tmpClient.Direction : '',
            City: tmpClient?.City ? tmpClient.City : '',
            Telephone: tmpClient?.Telephone ? tmpClient.Telephone : '',
            Email: tmpClient?.Email ? tmpClient.Email : '',
          });
        }
      });
  }

  private getClientFromForm(): Client {
    const form = this.clientForm.controls;
    return {
      RUT: form['RUT'].value,
      OT: form['OT'].value,
      Name: form['Name'].value,
      Giro: form['Giro'].value,
      Direction: form['Direction'].value,
      City: form['City'].value,
      Telephone: form['Telephone'].value,
      Email: form['Email'].value,
    };
  }

  private getEditedFields(): Client {
    const form = this.clientForm.controls;
    let client: Client = { IdClient: this.idClient };
    if (form['RUT'].dirty && form['RUT'].value != this.client.RUT) {
      client.RUT = form['RUT'].value;
    }
    if (form['OT'].dirty && form['OT'].value != this.client.OT) {
      client.OT = form['OT'].value;
    }
    if (form['Name'].dirty && form['Name'].value != this.client.Name) {
      client.Name = form['Name'].value;
    }
    if (form['Giro'].dirty && form['Giro'].value != this.client.Giro) {
      client.Giro = form['Giro'].value;
    }
    if (form['Direction'].dirty && form['Direction'].value != this.client.Direction) {
      client.Direction = form['Direction'].value;
    }
    if (form['City'].dirty && form['City'].value != this.client.City) {
      client.City = form['City'].value;
    }
    if (form['Telephone'].dirty && form['Telephone'].value != this.client.Telephone) {
      client.Telephone = form['Telephone'].value;
    }
    if (form['Email'].dirty && form['Email'].value != this.client.Email) {
      client.Email = form['Email'].value;
    }
    return client;
  }

  private createClient(): void {
    if (this.clientForm.errors || this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.showSnack('CLIENTS.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.loadingService.showLoading();
    this.clientService
      .createClient(this.getClientFromForm())
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(client => {
        const error = client as ErrorResponse;
        if (!client || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.REPEATED_RUT
              ? `CLIENTS.SNACK.${error.Error}`
              : 'CLIENTS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else {
          this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
          this.onGoBackButtonClick();
        }
      });
  }

  private updateClient(): void {
    if (this.clientForm.errors || this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.showSnack('CLIENTS.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.loadingService.showLoading();
    this.clientService
      .updateClient(this.getEditedFields())
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(client => {
        const error = client as ErrorResponse;
        if (!client || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.REPEATED_RUT
              ? `CLIENTS.SNACK.${error.Error}`
              : 'CLIENTS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else {
          this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
          this.onGoBackButtonClick();
        }
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
