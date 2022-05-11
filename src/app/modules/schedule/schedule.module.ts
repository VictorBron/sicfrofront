import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../../shared/modules/table/table.module';
import { SharedModule } from '../../shared/shared.module';
import { ClientsServiceModule } from '../clients/services/clients-service.module';
import { ScheduleFormComponent } from './components/schedule-form/schedule-form.component';
import { ScheduleCreateComponent } from './containers/schedule-create/schedule-create.component';
import { SchedulesListComponent } from './containers/schedules-list/schedules-list.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { SchedulesServiceModule } from './services/schedules-service.module';

@NgModule({
  declarations: [SchedulesListComponent, ScheduleCreateComponent, ScheduleFormComponent],
  imports: [
    CommonModule,
    SchedulesServiceModule,
    SharedModule,
    TableModule,
    TranslateModule.forChild(),
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ClientsServiceModule,
    FlexLayoutModule,
    ScheduleRoutingModule,
  ],
})
export class ScheduleModule {}
