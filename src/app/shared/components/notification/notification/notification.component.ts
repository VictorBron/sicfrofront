import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService } from './../../../services/notification-service/notification.service';
import { SnackModelEmitter } from '../../../models';
import { SnackBarComponent } from './../';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private snackComponent: SnackBarComponent, private notificationService: NotificationService) {}

  public ngOnInit(): void {
    this.subscribe();
  }

  public ngOnDestroy(): void {
    if (this.notificationService?.snack$) this.notificationService.snack$.unsubscribe();
  }

  private subscribe(): void {
    this.notificationService.snack$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((data: SnackModelEmitter) => {
      if (data) this.snackComponent.openSnackBar(data);
    });
  }
}
