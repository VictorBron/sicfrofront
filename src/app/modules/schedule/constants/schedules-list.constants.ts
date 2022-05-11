import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, DataType } from '../../../shared/modules/table/models';

export const SCHEDULES_LIST_TABLE_HEADERS_IDS = {
  OPTIONS: 'options-popover',
  CLIENT: 'Client',
  DAY_FROM: 'DayFrom',
  DAY_TO: 'DayTo',
  SCHEDULE: 'Schedule',
  COMMENT: 'Comment',
};
export const SCHEDULES_LIST_TABLE_HEADERS = [
  SCHEDULES_LIST_TABLE_HEADERS_IDS.OPTIONS,
  SCHEDULES_LIST_TABLE_HEADERS_IDS.CLIENT,
  SCHEDULES_LIST_TABLE_HEADERS_IDS.DAY_FROM,
  SCHEDULES_LIST_TABLE_HEADERS_IDS.DAY_TO,
  SCHEDULES_LIST_TABLE_HEADERS_IDS.SCHEDULE,
  SCHEDULES_LIST_TABLE_HEADERS_IDS.COMMENT,
];

export const getScheduleColumnsDef = (): ColumnDefinition[] => {
  return [
    {
      id: SCHEDULES_LIST_TABLE_HEADERS_IDS.CLIENT,
      header: 'SCHEDULES.CLIENT',
      order: true,
      dataType: DataType.NUMBER,
    },
    {
      id: SCHEDULES_LIST_TABLE_HEADERS_IDS.DAY_FROM,
      header: 'SCHEDULES.DAY_FROM',
      order: true,
      dataType: DataType.DATE,
    },
    {
      id: SCHEDULES_LIST_TABLE_HEADERS_IDS.DAY_TO,
      header: 'SCHEDULES.DAY_TO',
      order: true,
      dataType: DataType.DATE,
    },
    {
      id: SCHEDULES_LIST_TABLE_HEADERS_IDS.SCHEDULE,
      header: 'SCHEDULES.SCHEDULE',
      order: true,
      dataType: DataType.STRING,
    },
    {
      id: SCHEDULES_LIST_TABLE_HEADERS_IDS.COMMENT,
      header: 'SCHEDULES.COMMENT',
      order: true,
      dataType: DataType.STRING,
    },
  ];
};
