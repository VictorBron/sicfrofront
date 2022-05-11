import { MatTableDataSource } from '@angular/material/table';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  VEHICLE_DRIVER_TABLE_HEADERS,
  VEHICLE_DRIVER_LIST_TABLE_HEADERS_IDS,
  getRequestState,
  RequestState,
  ActionTableRowVehicleDriverEdit,
  ActionTableRowVehicleDriverNew,
  getCommonOptionsVehicleDriverEdit,
  getCommonOptionsVehicleDriverNew,
} from './../../constants';
import { VehicleDriver, Status } from './../../models';
import { OverlayOption } from '../../../../shared/modules/table/models';
import { TOOLTIPS } from '../../../../shared/constants';
import { openDialog } from '../../../../shared/utils';
import { CommonObject, ModalActionType, ModalDialogResult, ModalResponse } from '../../../../shared/models';

@Component({
  selector: 'app-table-relations',
  templateUrl: './table-relations.component.html',
  styleUrls: ['./table-relations.component.scss'],
})
export class TableRelationsComponent implements OnInit {
  @Input() set asociations$(newData$: BehaviorSubject<VehicleDriver[]>) {
    if (newData$ && newData$ instanceof BehaviorSubject) {
      newData$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((data: VehicleDriver[]) => {
        this._asociations = data;
        this.dataSource.data = data;
      });
    }
  }
  @Input() disabled: boolean = false;
  @Input() edit: boolean = false;
  get associations(): VehicleDriver[] {
    return this._asociations;
  }
  @Output() removeId = new EventEmitter<number>();
  @Output() status = new EventEmitter<Status>();

  public TOOLTIPS = TOOLTIPS;
  public optionsRowTable: OverlayOption[] = [];
  public dataSource = new MatTableDataSource<VehicleDriver>();
  public displayedColumnsVehicleDriver: string[] = [];

  // Subject
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _asociations: VehicleDriver[];

  constructor(private translate: TranslateService, private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.setTableConfiguration();
    this.displayedColumnsVehicleDriver = this.edit
      ? VEHICLE_DRIVER_TABLE_HEADERS
      : VEHICLE_DRIVER_TABLE_HEADERS.filter(header => header !== VEHICLE_DRIVER_LIST_TABLE_HEADERS_IDS.REQUEST_STATE);
  }

  public remove(element: VehicleDriver) {
    if (!element.IdRequest) this.removeId.emit(element.Id);
    else this.setStatus(element);
  }

  public setStatus(element: VehicleDriver) {
    openDialog(
      this.dialog,
      ModalActionType.YesCancel,
      'MODAL.TITLE.INFORMATION',
      'REQUEST_NEW.REQUEST_BASIC_DATA.MODAL.ANULATE_TRANSPORT',
    )
      .afterClosed()
      .subscribe((data: ModalDialogResult) => {
        if (data && data.buttonId == ModalResponse.Ok) {
          let status: Status = {
            Id: element.Id,
            Active: false,
          };
          element.IdRequest ?? (status.IdRequest = element.IdRequest);
          this.status.emit(status);
        }
      });
  }

  public getRequestState = (active: boolean): RequestState => getRequestState(active);

  private setTableConfiguration() {
    if (this.edit) this.setTableConfigurationOptionsEdit();
    else this.setTableConfigurationOptionsNew();
  }

  private setTableConfigurationOptionsEdit() {
    const options: ActionTableRowVehicleDriverEdit = {
      setInActive: (row: CommonObject) => this.setStatus(row as VehicleDriver),
      remove: (row: CommonObject) => this.remove(row as VehicleDriver),
    };
    this.optionsRowTable = getCommonOptionsVehicleDriverEdit(this.translate, options as unknown as CommonObject);
  }

  private setTableConfigurationOptionsNew() {
    const options: ActionTableRowVehicleDriverNew = {
      remove: (row: CommonObject) => this.remove(row as VehicleDriver),
    };
    this.optionsRowTable = getCommonOptionsVehicleDriverNew(this.translate, options as unknown as CommonObject);
  }
}
