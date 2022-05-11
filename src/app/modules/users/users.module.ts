import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './containers/users-list/users-list.component';
import { UsersServiceModule } from './services/users-service.module';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from '../../shared/modules/table/table.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserCreateComponent } from './containers/user-create/user-create.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UsersRoutingModule } from './users-routing.module';
import { ClientsServiceModule } from '../clients/services/clients-service.module';

@NgModule({
  declarations: [UsersListComponent, UserCreateComponent, UserFormComponent],
  imports: [
    CommonModule,
    UsersServiceModule,
    SharedModule,
    TableModule,
    TranslateModule.forChild(),
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    ClientsServiceModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {}
