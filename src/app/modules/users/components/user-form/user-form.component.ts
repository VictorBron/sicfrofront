import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  CLIENT_PERMISSION,
  USER_ACTIVE,
  USER_STATES,
  SNACK_CLASS,
  ERROR_HTTP_KEYS,
  FORM_TYPES,
  getTextByError,
  APP_URLS,
  itemNotInDb,
  openErrorSnack,
} from '../../../../shared/constants';
import { State, SnackModelEmitter, ErrorResponse, RequestParams } from '../../../../shared/models';
import { LoadingService, NotificationService } from '../../../../shared/services';
import { validatorCheckRUT } from '../../../../shared/utils';
import { Client } from '../../../clients/models';
import { ClientsService } from '../../../clients/services/clients.service';
import { FORM_TITLES, FROWARD_USER_TYPES, ID_CLIENTS } from '../../constants';
import { User } from '../../models';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() formMode: FORM_TYPES = FORM_TYPES.CREATE_FORM;
  public userForm: FormGroup = null;
  public formTypes = FORM_TYPES;
  public title = FORM_TITLES.CREATE;
  public isFroward = false;
  public clients: Client[] = [];
  public userTypes = FROWARD_USER_TYPES;
  public states: State[] = USER_STATES;

  private frowardClient: Client = null;
  private idUser: number = null;
  private user: User = null;
  private userPermissions: string = CLIENT_PERMISSION;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private formDisabled: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private clientsService: ClientsService,
    private loadingService: LoadingService,
    private router: Router,
    private translate: TranslateService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.title =
      this.formMode === FORM_TYPES.CREATE_FORM
        ? FORM_TITLES.CREATE
        : this.formMode === FORM_TYPES.DETAIL_FORM
        ? FORM_TITLES.DETAIL
        : FORM_TITLES.EDIT;

    if (this.formMode === FORM_TYPES.DETAIL_FORM || this.formMode === FORM_TYPES.EDIT_FORM) {
      this.idUser = this.activatedRoute.snapshot.params.id;
    }
    if (this.formMode === FORM_TYPES.DETAIL_FORM) {
      this.formDisabled = true;
    }
    this.initForm();
  }

  public onGoBackButtonClick(): void {
    this.router.navigate([APP_URLS.USERS_LIST.path]);
  }

  public onRemoveButtonClick(): void {
    this.loadingService.showLoading();
    this.usersService
      .deleteUser(this.user.IdUser)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        const error = user as ErrorResponse;
        if (!user || error.Error) {
          this.showSnack(
            error.Error === ERROR_HTTP_KEYS.KEY_ALREADY_USED
              ? `USERS.SNACK.KEY_ALREADY_USED`
              : 'USERS.SNACK.UNKNOWN_ERROR',
            SNACK_CLASS.ERROR,
          );
        } else this.showSnackSuccess();
      });
  }

  public onSaveButtonClick(): void {
    if (this.formMode === FORM_TYPES.CREATE_FORM) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }
  public onEditButtonClick(): void {
    this.formMode = FORM_TYPES.EDIT_FORM;
    this.userForm.enable();
    this.title = FORM_TITLES.EDIT;
  }

  public setIsFroward() {
    this.isFroward = this.userForm.controls['client'].value === this.frowardClient.IdClient;
  }

  public getTextByKey = (key: string): string =>
    this.userForm.get(key).dirty ? getTextByError(this.userForm.get(key).errors) : '';

  private createUser(): void {
    if (this.userForm.errors || this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showSnack('USERS.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }

    this.loadingService.showLoading();
    const user: User = this.getUserFromForm();
    this.usersService
      .createUser({ user } as RequestParams)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        const error = user as ErrorResponse;
        const users = user as number[];
        if (!user || error.Error || users.length === 0) {
          if (error.Error === ERROR_HTTP_KEYS.REPEATED_RUT)
            this.showSnack('USERS.SNACK.REPEATED_RUT', SNACK_CLASS.ERROR);
          else if (error.Error === ERROR_HTTP_KEYS.LOGIN_ALREADY_USED)
            this.showSnack('USERS.SNACK.REPEATED_LOGIN', SNACK_CLASS.ERROR);
          else this.showSnack('USERS.SNACK.UNKNOWN_ERROR', SNACK_CLASS.ERROR);
        } else {
          this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
          this.router.navigate([APP_URLS.USERS_LIST.path]);
        }
      });
  }

  private updateUser(): void {
    if (this.userForm.errors || this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showSnack('USERS.SNACK.FORM_ERROR', SNACK_CLASS.ERROR);
      return;
    }
    this.loadingService.showLoading();
    this.usersService
      .editUser(this.getEditedFields())
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        const error = user as ErrorResponse;
        if (!user || error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.REPEATED_RUT)
            this.showSnack('USERS.SNACK.REPEATED_RUT', SNACK_CLASS.ERROR);
          else if (error.Error === ERROR_HTTP_KEYS.LOGIN_ALREADY_USED)
            this.showSnack('USERS.SNACK.REPEATED_LOGIN', SNACK_CLASS.ERROR);
          else this.showSnack('USERS.SNACK.UNKNOWN_ERROR', SNACK_CLASS.ERROR);
        } else {
          this.showSnack('SNACK.SUCCESS', SNACK_CLASS.SUCCESS);
          this.router.navigate([APP_URLS.USERS_LIST.path]);
        }
      });
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        login: [{ value: '', disabled: this.formDisabled }, Validators.required],
        name: [{ value: '', disabled: this.formDisabled }, Validators.required],
        lastName: [{ value: '', disabled: this.formDisabled }, Validators.required],
        rut: [{ value: '', disabled: this.formDisabled }, Validators.required],
        phone: [{ value: '', disabled: this.formDisabled }, Validators.required],
        email: [{ value: '', disabled: this.formDisabled }, Validators.email],
        client: [{ value: '', disabled: this.formDisabled }, Validators.required],
        userType: [{ value: '', disabled: this.formDisabled }],
        state: [{ value: USER_ACTIVE, disabled: this.formDisabled }, Validators.required],
      },
      {
        validator: validatorCheckRUT('rut'),
      },
    );
    this.getClientsOptions();
  }

  private setFormValues(): void {
    this.loadingService.showLoading();
    this.usersService
      .getUserById(this.idUser)
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        const error = user as ErrorResponse;
        if (!user || error.Error) {
          if (error.Error === ERROR_HTTP_KEYS.ITEM_NOT_IN_DB)
            itemNotInDb(this.notificationService, this.router, [APP_URLS.USERS_LIST.path]);
          else openErrorSnack(this.notificationService);
        } else {
          const tmpUser = user as User;
          this.user = tmpUser;
          this.isFroward = tmpUser.Client !== null && tmpUser.Client.Name === this.frowardClient.Name;

          this.userPermissions = tmpUser.Permissions;
          this.userForm.patchValue({
            login: tmpUser.Login,
            email: tmpUser.Email,
            phone: tmpUser.Telephone,
            name: tmpUser.Name,
            lastName: tmpUser.LastName,
            client: tmpUser.Client?.IdClient ? tmpUser.Client.IdClient : -1,
            userType: tmpUser.Permissions,
            state: tmpUser.Active,
            rut: tmpUser.RUT,
          });
        }
      });
  }

  private getUserFromForm(): User {
    const form = this.userForm.controls;
    let permissions = this.userPermissions;
    if (this.formMode === FORM_TYPES.CREATE_FORM) {
      permissions = !this.isFroward ? CLIENT_PERMISSION : form['userType'].value;
    }
    return {
      Login: form['login'].value,
      Name: form['name'].value,
      LastName: form['lastName'].value,
      RUT: form['rut'].value,
      Telephone: form['phone'].value,
      Email: form['email'].value,
      Client: { IdClient: this.getIdClient() },
      Active: Boolean(form['state'].value),
      Permissions: permissions,
      LastEntry: new Date(),
      Password: '',
      IdUser: this.idUser,
    };
  }

  private getEditedFields(): User {
    let params: User = { IdUser: this.idUser };
    const form = this.userForm.controls;
    if (form['login'].dirty && this.user.Login !== form['login'].value) {
      params.Login = form['login'].value;
    }
    if (form['name'].dirty && this.user.Name !== form['name'].value) {
      params.Name = form['name'].value;
    }
    if (form['lastName'].dirty && this.user.LastName !== form['lastName'].value) {
      params.LastName = form['lastName'].value;
    }
    if (form['rut'].dirty && this.user.RUT !== form['rut'].value) {
      params.RUT = form['rut'].value;
    }
    if (form['phone'].dirty && this.user.Telephone !== form['phone'].value) {
      params.Telephone = form['phone'].value;
    }
    if (form['email'].dirty && this.user.Email !== form['email'].value) {
      params.Email = form['email'].value;
    }

    if (form['state'].dirty && this.user.Active !== form['state'].value) {
      params.Active = form['state'].value;
    }
    if (form['client'].dirty && !this.isFroward) {
      params.Permissions = CLIENT_PERMISSION;
    }
    if (form['userType'].dirty && this.isFroward) {
      params.Permissions = form['userType'].value;
    }
    if (this.user.Client.IdClient !== this.getIdClient()) {
      params.Client = { IdClient: this.getIdClient() };
    }
    return params;
  }

  private getClientsOptions(): void {
    this.loadingService.showLoading();
    this.clientsService
      .getAllClients()
      .pipe(finalize(() => this.loadingService.hideLoading()))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(clients => {
        const error = clients as ErrorResponse;
        if (error && error.Error) {
          this.showSnack('USERS.SNACK.CLIENTS_ERROR', SNACK_CLASS.ERROR);
        } else {
          const tmpClients = clients as Client[];
          this.clients = tmpClients;
          this.frowardClient = tmpClients.find(c => c.IdClient == ID_CLIENTS.FROWARD);
          if (this.formMode === FORM_TYPES.DETAIL_FORM || this.formMode === FORM_TYPES.EDIT_FORM) {
            this.setFormValues();
          }
        }
      });
  }

  private getIdClient(): number {
    return this.userForm.controls['client']?.value;
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
