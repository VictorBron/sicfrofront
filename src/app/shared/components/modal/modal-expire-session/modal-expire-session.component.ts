import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { TIME_TO_RENEW } from '../../../constants/dialog';
import { AuthenticationService } from '../../../services';
import { CountDownActions } from '../../expire-session/constants';

@Component({
  selector: 'app-modal-expire-session',
  templateUrl: './modal-expire-session.component.html',
  styleUrls: ['./modal-expire-session.component.scss'],
})
export class ModalExpireSessionComponent implements OnInit, AfterViewInit {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  public config: CountdownConfig = {
    leftTime: TIME_TO_RENEW,
    formatDate: ({ date }) => `${date / 1000}`,
  };

  public title: string = '';
  public text: string = '';
  private status: number = null;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    public dialogRef: MatDialogRef<ModalExpireSessionComponent>,
  ) {
    dialogRef.disableClose = true;
  }

  public ngOnInit(): void {
    this.title = 'EXPIRE_SESSION.TITLE.NEAR';
    this.text = 'EXPIRE_SESSION.TEXT.NEAR';
  }

  public ngAfterViewInit(): void {
    this.countdown.begin();
  }

  public timeHandler(event: CountdownEvent): void {
    this.status = event.status;
    if (event.action === CountDownActions.DONE) {
      this.auth.logout();
      this.title = 'EXPIRE_SESSION.TITLE.DONE';
      this.text = 'EXPIRE_SESSION.TEXT.DONE';
    }
  }

  public onContinueClick(): void {
    if (this.status === 0) {
      this.countdown.stop();
      this.auth.renewTimeExpiration();
    }
    this.dialogRef.close();
  }
}
