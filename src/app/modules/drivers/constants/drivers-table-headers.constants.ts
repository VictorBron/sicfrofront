import { ColumnDefinition, DataType } from '../../../shared/modules/table/models';

export const DRIVERS_TABLE_HEADERS = ['driver-detail', 'Name', 'LastName', 'RUT'];

export const getDriverColumnsDef = (): ColumnDefinition[] => {
  return [
    {
      id: 'Name',
      header: 'DRIVERS.NAME',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: 'LastName',
      header: 'DRIVERS.LAST_NAME',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: 'RUT',
      header: 'DRIVERS.RUT',
      order: true,
      dataType: DataType.STRING,
    },
  ];
};
