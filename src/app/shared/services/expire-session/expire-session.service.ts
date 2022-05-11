import { BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ExpireSessionServiceModule } from './expire-session-service.module';

@Injectable({
  providedIn: ExpireSessionServiceModule,
})
export class ExpireSessionService implements OnDestroy {
  public secondsToExpire$ = new BehaviorSubject<number>(null);
  public renewCounter$ = new BehaviorSubject<boolean>(null);

  public ngOnDestroy(): void {
    this.secondsToExpire$.unsubscribe();
    this.renewCounter$.unsubscribe();
  }

  constructor() {}
}
