import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { VehiclesRoutingModule } from './vehicles-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { VehiclesServiceModule } from './services/vehicles-service.module';
import { VehicleListComponent, VehicleFormComponent, VehicleCreateComponent } from './components';
import { TableModule } from '../../shared/modules/table/table.module';

@NgModule({
  declarations: [VehicleListComponent, VehicleFormComponent, VehicleCreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatInputModule,
    SharedModule,
    MatTableModule,
    VehiclesRoutingModule,
    TranslateModule.forChild(),
    MatSelectModule,
    VehiclesServiceModule,
    TableModule,
  ],
  exports: [VehicleListComponent],
})
export class VehiclesModule {}
