import { ID_PARAM } from '../url-params.constants';

export const CLIENTS = {
  CLIENTS_LIST: {
    path: 'clients',
    shortPath: '',
  },
  CLIENT_CREATE: {
    path: 'clients/new',
    shortPath: 'new',
  },
  CLIENT_DETAIL: {
    path: `clients/detail/${ID_PARAM}`,
    shortPath: `detail/${ID_PARAM}`,
  },
};
