import { ColumnDefinition, DataType } from '../../../shared/modules/table/models';

export const CLIENTS_LIST_TABLE_HEADERS_IDS = {
  ID: 'IdClient',
  RUT: 'RUT',
  OT: 'OT',
  DETAIL: 'client-detail',
};
export const CLIENTS_LIST_TABLE_HEADERS = [
  CLIENTS_LIST_TABLE_HEADERS_IDS.DETAIL,
  CLIENTS_LIST_TABLE_HEADERS_IDS.ID,
  CLIENTS_LIST_TABLE_HEADERS_IDS.RUT,
  CLIENTS_LIST_TABLE_HEADERS_IDS.OT,
];

export const getClientColumnsDef = (): ColumnDefinition[] => {
  return [
    {
      id: CLIENTS_LIST_TABLE_HEADERS_IDS.ID,
      header: 'CLIENTS.ID',
      order: true,
      dataType: DataType.NUMBER,
    },
    {
      id: CLIENTS_LIST_TABLE_HEADERS_IDS.RUT,
      header: 'CLIENTS.RUT',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: CLIENTS_LIST_TABLE_HEADERS_IDS.OT,
      header: 'CLIENTS.OT',
      order: true,
      dataType: DataType.STRING,
    },
  ];
};
