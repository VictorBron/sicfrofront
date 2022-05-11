import { ID_PARAM } from './../url-params.constants';

export const REQUESTS = {
  REQUESTS_LIST: {
    path: 'requests',
    shortPath: '',
  },
  REQUESTS_NEW: {
    path: 'requests/new',
    shortPath: 'new',
  },
  REQUEST_DETAIL: {
    path: `requests/detail/${ID_PARAM}`,
    shortPath: `detail/${ID_PARAM}`,
  },
  REQUEST_EDIT: {
    path: `requests/edit/${ID_PARAM}`,
    shortPath: `edit/${ID_PARAM}`,
  },
  REQUEST_UPLOAD: {
    path: 'requests/upload',
    shortPath: `upload`,
  },
};
