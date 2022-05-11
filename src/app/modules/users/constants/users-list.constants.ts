import { ColumnDefinition, DataType } from '../../../shared/modules/table/models';

export const USERS_LIST_TABLE_HEADERS_IDS = {
  LOGIN: 'Login',
  NAME: 'Name',
  RUT: 'RUT',
  PHONE: 'Telephone',
  EMAIL: 'Email',
  CLIENT: 'ClientName',
  LAST_DATE: 'LastEntry',
  USER_DETAIL: 'users-detail',
};
export const USERS_LIST_TABLE_HEADERS = [
  USERS_LIST_TABLE_HEADERS_IDS.USER_DETAIL,
  USERS_LIST_TABLE_HEADERS_IDS.LOGIN,
  USERS_LIST_TABLE_HEADERS_IDS.NAME,
  USERS_LIST_TABLE_HEADERS_IDS.RUT,
  USERS_LIST_TABLE_HEADERS_IDS.PHONE,
  USERS_LIST_TABLE_HEADERS_IDS.EMAIL,
  USERS_LIST_TABLE_HEADERS_IDS.CLIENT,
  USERS_LIST_TABLE_HEADERS_IDS.LAST_DATE,
];

export const getUsertColumnsDef = (): ColumnDefinition[] => {
  return [
    {
      id: USERS_LIST_TABLE_HEADERS_IDS.LOGIN,
      header: 'USERS.LOGIN',
      order: true,
      dataType: DataType.NUMBER,
    },
    {
      id: USERS_LIST_TABLE_HEADERS_IDS.NAME,
      header: 'USERS.NAME_LAST_NAME',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: USERS_LIST_TABLE_HEADERS_IDS.RUT,
      header: 'USERS.RUT',
      order: true,
      minWidth: '100px',
      dataType: DataType.STRING,
    },
    {
      id: USERS_LIST_TABLE_HEADERS_IDS.PHONE,
      header: 'USERS.PHONE',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: USERS_LIST_TABLE_HEADERS_IDS.EMAIL,
      header: 'USERS.EMAIL',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: USERS_LIST_TABLE_HEADERS_IDS.CLIENT,
      header: 'USERS.CLIENT',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: USERS_LIST_TABLE_HEADERS_IDS.LAST_DATE,
      header: 'USERS.LAST_DATE',
      order: true,
      dataType: DataType.STRING,
    },
  ];
};
