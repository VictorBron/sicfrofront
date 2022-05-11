import { TranslateService } from '@ngx-translate/core';
import { OverlayOption } from '../../../../shared/modules/table/models';
import { VehicleDriver } from '../../models';
import { ActionTableRowVehicleDriverEdit, ActionTableRowVehicleDriverNew } from './action-table-row-vehicle-driver';
import { TOOLTIPS } from './../../../../shared/constants/tooltips.constants';
import { CommonObject } from '../../../../shared/models';

export const getCommonOptionsVehicleDriverEdit = (
  translate: TranslateService,
  actionRow: ActionTableRowVehicleDriverEdit,
): OverlayOption[] => {
  return [
    {
      icon: TOOLTIPS.DONUT,
      text: 'TABLE.ACTIONS.SET_INACTIVE',
      fn: (row: CommonObject) => actionRow.setInActive(row),
      color: 'red',
      disable: (row: CommonObject) => {
        if (!(row as VehicleDriver).IdRequest) return true;
        else return !(row as VehicleDriver).Active;
      },
    },
    {
      icon: TOOLTIPS.REMOVE,
      text: 'TABLE.ACTIONS.REMOVE',
      fn: (row: CommonObject) => actionRow.remove(row),
      disable: (row: CommonObject) => ((row as VehicleDriver).IdRequest ? true : (false as boolean)),
    },
  ];
};

export const getCommonOptionsVehicleDriverNew = (
  translate: TranslateService,
  actionRow: ActionTableRowVehicleDriverNew,
): OverlayOption[] => {
  return [
    {
      icon: TOOLTIPS.REMOVE,
      text: 'TABLE.ACTIONS.REMOVE',
      fn: (row: CommonObject) => actionRow.remove(row),
      disable: (row: CommonObject) => ((row as VehicleDriver).IdRequest ? true : (false as boolean)),
    },
  ];
};
