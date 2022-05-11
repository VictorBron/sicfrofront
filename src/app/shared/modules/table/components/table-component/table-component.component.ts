import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableItem } from '../../../../models';
import { ColumnDefinition, DataType, OverlayOption } from '../../models';

const OPTIONS_ID = 'options';
@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.scss'],
})
export class TableComponent {
  /* Table*/
  @Input() set columns(colsDef: ColumnDefinition[]) {
    const maped = colsDef.map(col => col.id);
    this.displayedColumns = this.displayedColumns ? [...this.displayedColumns, ...maped] : maped;
    this.columnsDef = colsDef;
  }
  @Input() set data(data: TableItem[]) {
    this._data = data;
    this.dataSource.data = data;
    this.dataSourceFiltered.data = data;
    this.setFiltersActivation(data);
  }
  @Input() set optionsRowTable(options: OverlayOption[]) {
    this.options = options;
    if (this.options?.length) {
      this.displayedColumns = this.displayedColumns ? [OPTIONS_ID, ...this.displayedColumns] : [OPTIONS_ID];
    }
  }
  public OPTIONS_ID: string = OPTIONS_ID;
  public displayedColumns: string[];
  public columnsDef: ColumnDefinition[] = [];
  public options: OverlayOption[];
  public dataSource = new MatTableDataSource<TableItem>();
  /* Paginator */
  public length = 0;
  public pageSize = 5;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public dataSourceFiltered = new MatTableDataSource<TableItem>();
  public currentPageEvent: PageEvent;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  private _data: TableItem[];

  public setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  public pageEvent(pageEvent: PageEvent) {
    const start = pageEvent.pageIndex * pageEvent.pageSize;
    const end = start + pageEvent.pageSize;
    this.dataSourceFiltered.data = this.dataSource.data.slice(start, end);
    this.currentPageEvent = pageEvent;
  }

  public sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    const dataColumn = this.columnsDef.find(column => column.id === sort.active);

    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
    } else {
      if (dataColumn.dataType === DataType.DATE) {
        this.dataSource.data = data.sort((a, b) => {
          const aValue = (a as any)[sort.active].split('/');
          const aDate = new Date(aValue[2], aValue[1], aValue[0]);
          const bValue = (b as any)[sort.active].split('/');
          const bDate = new Date(bValue[2], bValue[1], bValue[0]);
          return (aDate < bDate ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
      } else {
        this.dataSource.data = data.sort((a, b) => {
          const aValue = (a as any)[sort.active];
          const bValue = (b as any)[sort.active];
          return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
      }
    }

    this.pageEvent(this.currentPageEvent);
  }

  private setFiltersActivation(tableItem: TableItem[]) {
    this.dataSourceFiltered.data = tableItem.slice();
    this.length = tableItem.length;
    this.pageEvent({
      length: tableItem.length,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      previousPageIndex: 0,
    });
  }
}
