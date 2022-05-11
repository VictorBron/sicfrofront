import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '../../shared/modules/table/table.module';
import { SharedModule } from './../../shared/shared.module';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientCreateComponent } from './containers/client-create/client-create.component';
import { ClientsListComponent } from './containers/clients-list/clients-list.component';
import { ClientsServiceModule } from './services/clients-service.module';

@NgModule({
  declarations: [ClientsListComponent, ClientCreateComponent, ClientFormComponent],
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
    TranslateModule.forChild(),
    ClientsRoutingModule,
    ClientsServiceModule,
    TableModule,
  ],
  exports: [ClientsListComponent],
})
export class ClientsModule {}
