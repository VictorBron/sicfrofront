import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { DriverFormComponent } from './components/driver-form/driver-form.component';
import { DriversListComponent } from './containers/drivers-list/drivers-list.component';
import { DriversRoutingModule } from './drivers-routing.module';
import { DriverCreateComponent } from './containers/driver-create/driver-create.component';
import { TableModule } from '../../shared/modules/table/table.module';

@NgModule({
  declarations: [DriversListComponent, DriverFormComponent, DriverCreateComponent],
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
    TranslateModule,
    DriversRoutingModule,
    TranslateModule,
    MatSelectModule,
    TableModule,
  ],
  exports: [DriversListComponent],
})
export class DriversModule {}
