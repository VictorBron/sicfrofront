import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificationServiceModule } from '../../services/notification-service/notification-service.module';
import { SnackBarComponent } from '.';
import { NotificationComponent } from './notification';

@NgModule({
  imports: [CommonModule, MatSnackBarModule, MatDialogModule, NotificationServiceModule],
  declarations: [NotificationComponent, SnackBarComponent],
  exports: [NotificationComponent],
  providers: [TranslateService, SnackBarComponent],
})
export class NotificationModule {}
