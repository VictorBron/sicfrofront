import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { LogInComponent } from './containers/log-in/log-in.component';
import { RecoverPassComponent } from './components/recover-pass/recover-pass.component';
import { LogInRoutingModule } from './log-in-routing.module';
import { LogInServiceModule } from './services/log-in-service.module';

@NgModule({
  declarations: [LogInComponent, RecoverPassComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatInputModule,
    SharedModule,
    LogInRoutingModule,
    LogInServiceModule,
    TranslateModule.forChild(),
  ],
  exports: [LogInComponent],
})
export class LogInModule {}
