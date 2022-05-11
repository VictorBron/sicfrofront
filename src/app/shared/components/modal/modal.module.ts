import { MatIconModule } from '@angular/material/icon';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import es from '@angular/common/locales/es';
import { CountdownModule } from 'ngx-countdown';
import { ModalDialogComponent, ModalExpireSessionComponent } from '.';

registerLocaleData(es);

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule.forChild(),
    MatIconModule,
    CountdownModule,
    MatTooltipModule,
  ],
  declarations: [ModalDialogComponent, ModalExpireSessionComponent],
  exports: [ModalDialogComponent, ModalExpireSessionComponent],
  providers: [TranslateService, { provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class ModalModule {}
