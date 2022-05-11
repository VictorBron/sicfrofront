import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { NotAllowedComponent, GeneralLoadingComponent, WaitSpinnerComponent } from './components';
import { FormValidatorServiceModule } from './services';
import { ModalModule } from './components/modal/modal.module';
import { TableModule } from './modules/table/table.module';

@NgModule({
  declarations: [GeneralLoadingComponent, WaitSpinnerComponent, NotAllowedComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatProgressSpinnerModule,
    OverlayModule,
    FormValidatorServiceModule,
    MatIconModule,
    ModalModule,
    TableModule,
  ],
  exports: [GeneralLoadingComponent, MatIconModule],
})
export class SharedModule {}
