import { ID_PARAM } from '../url-params.constants';

export const DRIVERS = {
  DRIVERS_LIST: {
    path: 'drivers',
    shortPath: '',
  },
  DRIVER_CREATE: {
    path: 'drivers/new',
    shortPath: 'new',
  },
  DRIVER_DETAIL: {
    path: `drivers/detail/${ID_PARAM}`,
    shortPath: `detail/${ID_PARAM}`,
  },
};
