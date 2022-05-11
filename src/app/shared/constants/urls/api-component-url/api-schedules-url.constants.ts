import { URLDef } from '../../../models/api-URL.model';

export const SCHEDULES_API: URLDef = {
  GET_SCHEDULES: {
    key: 'GET_SCHEDULES',
    path: 'schedule/schedules',
  },
  GET_AVAILABLE_SCHEDULES: {
    key: 'GET_AVAILABLE_SCHEDULES',
    path: 'schedule/schedules/available',
  },
  GET_SCHEDULE_BY_ID: {
    key: 'GET_SCHEDULE_BY_ID',
    path: 'schedule/schedule/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  CREATE_SCHEDULE: {
    key: 'CREATE_SCHEDULE',
    path: 'schedule/schedules',
  },
  EDIT_SCHEDULE_BY_ID: {
    key: 'EDIT_SCHEDULE_BY_ID',
    path: 'schedule/schedule/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
};
