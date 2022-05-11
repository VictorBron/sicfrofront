import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import es from '@angular/common/locales/es';
import { CountdownModule } from 'ngx-countdown';
import { ExpireSessionComponent } from '..';
import { ExpireSessionServiceModule } from '../../services';

registerLocaleData(es);

@NgModule({
  imports: [CommonModule, MatDialogModule, CountdownModule, ExpireSessionServiceModule],
  declarations: [ExpireSessionComponent],
  exports: [ExpireSessionComponent],
  providers: [TranslateService, { provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class ExpireSessionModule {}
