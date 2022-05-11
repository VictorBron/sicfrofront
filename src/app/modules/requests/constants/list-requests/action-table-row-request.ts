import { CommonObject } from '../../../../shared/models';

export interface ActionTableRowRequestEdit {
  detail?: (row: CommonObject) => void;
  edit?: (row: CommonObject) => void;
  changeStatus?: (row: CommonObject) => void;
}

export interface ActionTableRowRequestRead {
  detail?: (row: CommonObject) => void;
  edit?: (row: CommonObject) => void;
  changeStatus?: (row: CommonObject) => void;
}
