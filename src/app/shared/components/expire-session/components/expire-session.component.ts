import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalExpireSessionComponent } from '../..';
import { AuthenticationService, ExpireSessionService } from '../../../services';
import { EnvironmentService } from '../../../services/environment/environment.service';
import { CountDownActions } from '../constants';

@Component({
  selector: 'app-expire-session',
  templateUrl: './expire-session.component.html',
  styleUrls: ['./expire-session.component.scss'],
})
export class ExpireSessionComponent implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  public config: CountdownConfig = {};
  public countdownStarted: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _obsSecondsToExpire: Subscription = new Subscription();
  private _obsRenewCounter: Subscription = new Subscription();
  private _dialogInstance: MatDialogRef<unknown, any> = null;

  constructor(
    private dialog: MatDialog,
    private auth: AuthenticationService,
    private expireSessionService: ExpireSessionService,
    private env: EnvironmentService,
  ) {}

  public ngOnInit(): void {
    this.subscribe();
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.unsubscribe();
    this._obsSecondsToExpire.unsubscribe();
    this._obsRenewCounter.unsubscribe();
  }

  public timeHandler(event: CountdownEvent): void {
    if (
      event.action === CountDownActions.NOTIFY &&
      event.left !== 0 &&
      event.left !== this.config.leftTime * 1000 &&
      this.auth.getCurrentToken()
    ) {
      if (!this._dialogInstance) {
        this._dialogInstance = this.dialog.open(ModalExpireSessionComponent);
        this._dialogInstance.afterClosed().subscribe((data: any) => {
          this._dialogInstance = null;
        });
      }
    }
  }

  private subscribe(): void {
    this._obsSecondsToExpire = this.expireSessionService.secondsToExpire$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(time => {
        if (time) {
          if (time !== -1) this.beginCountDown(time);
          else if (time === -1) this.stopCounter();
        }
      });

    this._obsRenewCounter = this.expireSessionService.renewCounter$
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(renew => {
        if (renew && this.countdownStarted) this.restartCountDown();
      });
  }

  private beginCountDown(time: number): void {
    this.config = {
      leftTime: time,
      notify: [time - this.env.data.sessionNotifyEnding * 60],
    };
    this.countdownStarted = true;
  }

  private stopCounter(): void {
    this.countdown.config.notify = null;
    this.countdown.config.leftTime = null;
  }

  private restartCountDown(): void {
    this.countdown?.restart();
  }
}
