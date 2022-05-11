import { URLDef } from '../../../models/api-URL.model';

export const REQUESTS_API: URLDef = {
  GET_REQUESTS: {
    key: 'GET_REQUESTS',
    path: 'request/requests',
  },
  GET_REQUEST: {
    key: 'GET_REQUEST',
    path: 'request/request/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  POST_REQUEST: {
    key: 'POST_REQUEST',
    path: 'request/request',
  },
  POST_REQUESTS: {
    key: 'POST_REQUESTS',
    path: 'request/requests',
  },
  UPDATE_REQUEST: {
    key: 'UPDATE_REQUEST',
    path: 'request/requests/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  UPDATE_REQUEST_STATE: {
    key: 'UPDATE_REQUEST',
    path: 'request/request/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
};
