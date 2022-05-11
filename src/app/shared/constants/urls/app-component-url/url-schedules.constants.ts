import { ID_PARAM } from '../url-params.constants';

export const SCHEDULES = {
  SCHEDULES_LIST: {
    path: 'schedules',
    shortPath: '',
  },
  SCHEDULE_DETAIL: {
    path: `schedules/detail/${ID_PARAM}`,
    shortPath: `detail/${ID_PARAM}`,
  },
  SCHEDULE_CREATE: {
    path: 'schedules/new',
    shortPath: 'new',
  },
};
