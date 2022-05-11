import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, DataType } from '../../../shared/modules/table/models';

export const VEHICLE_LIST_TABLE_HEADERS_IDS = {
  ID: 'IdVehicle',
  PATENT: 'Patent',
  TYPE: 'VehicleType',
  VEHICLE_DETAIL: 'vehicle-detail',
};
export const VEHICLE_LIST_TABLE_HEADERS = [
  VEHICLE_LIST_TABLE_HEADERS_IDS.VEHICLE_DETAIL,
  VEHICLE_LIST_TABLE_HEADERS_IDS.ID,
  VEHICLE_LIST_TABLE_HEADERS_IDS.TYPE,
  VEHICLE_LIST_TABLE_HEADERS_IDS.PATENT,
];

export const getVehicleColumnsDef = (): ColumnDefinition[] => {
  return [
    {
      id: VEHICLE_LIST_TABLE_HEADERS_IDS.ID,
      header: 'VEHICLES.ID_VEHICLE',
      order: true,
      dataType: DataType.NUMBER,
    },
    {
      id: VEHICLE_LIST_TABLE_HEADERS_IDS.TYPE,
      header: 'VEHICLES.TYPE_VEHICLE',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: VEHICLE_LIST_TABLE_HEADERS_IDS.PATENT,
      header: 'VEHICLES.PATENT',
      order: true,
      dataType: DataType.STRING,
    },
  ];
};
