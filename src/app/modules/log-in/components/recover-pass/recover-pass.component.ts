import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ErrorResponse } from '../../../../shared/models';
import { LogInService } from '../../services/log-in.service';
import { getTextByError } from '../../../../shared/constants';
import { LoadingService } from '../../../../shared/services';
import { validatorCheckSamePassword } from '../../../../shared/utils';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.component.html',
  styleUrls: ['./recover-pass.component.scss'],
})
export class RecoverPassComponent implements OnInit {
  @Input() token: string = null;
  @Output() cancelClick = new EventEmitter<Boolean>(null);
  public recoverPassForm: FormGroup = null;
  public dataSent: boolean = false;
  public requestStatus: string = '';
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private loadingService: LoadingService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private logInService: LogInService,
  ) {}

  public ngOnInit(): void {
    this.initForm();
  }

  public onChangePassword(): void {
    if (this.recoverPassForm.valid) {
      const user = btoa(`${this.recoverPassForm.get('email').value}&${this.recoverPassForm.get('newPassword').value}`);

      this.logInService
        .changePassword(user, this.token)
        .pipe(finalize(() => this.loadingService.hideLoading()))
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(status => {
          const error = status as ErrorResponse;
          this.dataSent = true;
          if (error && error.Error) {
            this.requestStatus = 'LOGIN.PASSWORD_ERROR';
          } else {
            this.requestStatus = 'LOGIN.PASSWORD_CHANGED';
          }
        });
    }
  }

  public onCancelClick(): void {
    this.cancelClick.emit(true);
  }

  public getTextByKey = (key: string): string =>
    this.recoverPassForm.get(key)?.dirty ? getTextByError(this.recoverPassForm.get(key)?.errors) : '';

  private initForm(): void {
    this.recoverPassForm = this.formBuilder.group(
      {
        email: ['', Validators.email],
        newPassword: ['', Validators.required],
        renewPassword: ['', Validators.required],
      },
      {
        validator: validatorCheckSamePassword('newPassword', 'renewPassword'),
      },
    );
  }
}
