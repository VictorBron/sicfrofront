import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { APP_URLS, ERROR_HTTP_KEYS, getTextByError, SNACK_CLASS } from '../../../../shared/constants';
import { ErrorResponse, SnackModelEmitter } from '../../../../shared/models';
import { AuthenticationService, LoadingService, NotificationService } from '../../../../shared/services';
import { LogInService } from './../../services/log-in.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  public logInForm: FormGroup = null;
  public recoverPassForm: FormGroup = null;
  public error: string;
  public showMain: boolean = true;
  public showEmailForm: boolean = false;
  public showRecoverComponent: boolean = false;
  public showEmailConfirmation: boolean = false;
  public token: string = null;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private loadingService: LoadingService,
    private logInService: LogInService,
    private notificationService: NotificationService,
  ) {
    /* empty block */
  }

  public ngOnInit(): void {
    this.initializeFormGroup();
    const token: string = this.router.routerState.snapshot.root.queryParams?.tokenId;
    if (token) {
      this.token = token;
      this.showMain = false;
      this.showEmailForm = false;
      this.showRecoverComponent = true;
    }
  }

  public onLoginButtonClick() {
    this.loadingService.showLoading();
    if (this.logInForm.valid) {
      const user = btoa(`${this.logInForm.controls.user.value}&${this.logInForm.controls.password.value}`);

      this.auth
        .login(user)
        .pipe(finalize(() => this.loadingService.hideLoading()))
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(tokenCode => {
          const error = tokenCode as ErrorResponse;
          if (error && error.Error) {
            if (error.Error === ERROR_HTTP_KEYS.ACC_BLOQUED) {
              this.showSnackError('LOGIN.SNACK.BLOQUED');
            } else this.showSnackError('LOGIN.SNACK.DENIED');
          } else {
            this.router.navigate([APP_URLS.HOME.path]);
          }
        });
    }
  }

  private showSnackError(message: string): void {
    this.notificationService.snack$.next({
      message: message,
      action: 'SNACK.ACTIONS.OK',
      class: SNACK_CLASS.ERROR,
    } as SnackModelEmitter);
  }
  public onRestorePassswordClick(): void {
    if (this.showMain) {
      this.showMain = false;
      this.showEmailForm = true;
      return;
    } else if (this.showEmailForm) {
      this.showEmailForm = false;
      this.showMain = true;
      return;
    }
    if (!this.showMain && !this.showEmailForm) {
      this.showMain = true;
      return;
    }
  }

  public onCancelClick(): void {
    this.router.navigate([APP_URLS.LOGIN.path]);
    this.showMain = true;
    this.showEmailForm = false;
    this.showRecoverComponent = false;
  }

  public onRequestClick(): void {
    if (this.recoverPassForm.valid) {
      const email: string = this.recoverPassForm.get('email').value;
      this.logInService
        .requestToken(email)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.showEmailForm = false;
          this.showEmailConfirmation = true;
        });
    }
  }

  public getTextByKey(key: string): string {
    return this.logInForm.get(key).dirty ? getTextByError(this.logInForm.get(key).errors) : '';
  }

  public getTextByKeyRecover(key: string): string {
    return this.recoverPassForm.get(key).dirty ? getTextByError(this.recoverPassForm.get(key).errors) : '';
  }

  private initializeFormGroup() {
    this.logInForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.recoverPassForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }
}
