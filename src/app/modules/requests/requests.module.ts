import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedModule } from '../../shared/shared.module';
import { RequestListComponent, RequestNewComponent, RequestDetailComponent, RequestEditComponent } from './containers';
import {
  VehicleDriverComponent,
  DriverDataComponent,
  VehicleDataComponent,
  TableRelationsComponent,
  RequestDataComponent,
  RequestConfirmComponent,
  RequestListTableFilterComponent,
} from './components';
import { TableModule } from '../../shared/modules/table/table.module';
import { RequestUploadFileComponent } from './components/request-upload-file/upload-file.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RequestsRoutingModule } from './requests-routing.module';
import { VehiclesServiceModule } from '../vehicles/services/vehicles-service.module';

@NgModule({
  declarations: [
    RequestListComponent,
    RequestNewComponent,
    VehicleDriverComponent,
    DriverDataComponent,
    VehicleDataComponent,
    TableRelationsComponent,
    RequestDataComponent,
    RequestConfirmComponent,
    RequestListTableFilterComponent,
    RequestDetailComponent,
    RequestEditComponent,
    RequestUploadFileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatInputModule,
    SharedModule,
    TranslateModule,
    MatStepperModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    TableModule,
    RequestsRoutingModule,
    VehiclesServiceModule,
  ],
  exports: [
    RequestListComponent,
    RequestNewComponent,
    RequestDetailComponent,
    RequestEditComponent,
    RequestUploadFileComponent,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class RequestModule {}
