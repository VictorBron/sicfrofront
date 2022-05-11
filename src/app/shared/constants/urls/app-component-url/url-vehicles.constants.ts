import { ID_PARAM } from '../url-params.constants';

export const VEHICLES = {
  VEHICLES_LIST: {
    path: 'vehicles',
    shortPath: '',
  },
  VEHICLE_CREATE: {
    path: 'vehicles/new',
    shortPath: 'new',
  },
  VEHICLE_DETAIL: {
    path: `vehicles/detail/${ID_PARAM}`,
    shortPath: `detail/${ID_PARAM}`,
  },
};
