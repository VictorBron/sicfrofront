import { CommonObject } from '../../../../shared/models';

export interface ActionTableRowVehicleDriverNew {
  remove?: (row: CommonObject) => void;
}

export interface ActionTableRowVehicleDriverEdit {
  setInActive?: (row: CommonObject) => void;
  remove?: (row: CommonObject) => void;
}
