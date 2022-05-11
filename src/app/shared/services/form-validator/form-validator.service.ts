import { Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { FormValidatorServiceModule } from './form-validator-service.module';
import { takeUntil } from 'rxjs/operators';
import { IFormValidator } from '../../models';

@Injectable({
  providedIn: FormValidatorServiceModule,
})
export class FormValidatorService implements OnDestroy {
  public trigger$ = new Subject<IFormValidator>();
  public response$ = new Subject<IFormValidator>();
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
    this.subscribe();
  }

  public ngOnDestroy(): void {
    if (this.trigger$) this.trigger$.unsubscribe();
    if (this.response$) this.response$.unsubscribe();
  }

  private subscribe(): void {
    this.trigger$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((data: IFormValidator) => {
      if (data) this.checkForm(data);
    });
  }

  private checkForm(data: IFormValidator): void {
    Object.keys(data.formGroup.controls).forEach(key => {
      data.formGroup.get(key).markAsDirty();
    });
    if (data.response)
      this.response$.next({ ...data, haveErrors: !data.formGroup.valid, notDisabled: !data.formGroup.disabled });
  }
}
