import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayOptionsComponent, TableComponent } from './components';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [OverlayOptionsComponent, TableComponent],
  imports: [
    CommonModule,
    OverlayModule,
    MatIconModule,
    TranslateModule.forChild(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [OverlayOptionsComponent, TableComponent],
})
export class TableModule {}
