import { CommonObject } from '../../../models';

export interface ActionTableRow {
  detail?: (row: CommonObject) => void;
  remove?: (row: CommonObject) => void;
}
