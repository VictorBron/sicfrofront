import { BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { SnackModelEmitter } from '../../models/snack-model-emitter';
import { NotificationServiceModule } from './notification-service.module';

@Injectable({
  providedIn: NotificationServiceModule,
})
export class NotificationService implements OnDestroy {
  public snack$ = new BehaviorSubject<SnackModelEmitter>(null);

  constructor() {}

  public ngOnDestroy(): void {
    this.snack$.unsubscribe();
  }
}
