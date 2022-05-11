import { URLDef } from '../../../models/api-URL.model';

export const CLIENTS_API: URLDef = {
  GET_CLIENTS: {
    key: 'GET_CLIENTS',
    path: 'client/clients',
  },
  CREATE_CLIENT: {
    key: 'CREATE_CLIENT',
    path: 'client/clients',
  },
  EDIT_CLIENT_BY_ID: {
    key: 'UPDATE_CLIENT',
    path: 'client/client/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  GET_CLIENT_BY_ID: {
    key: 'GET_CLIENT_BY_ID',
    path: 'client/client/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  DELETE_CLIENT: {
    key: 'DELETE_CLIENT',
    path: 'client/client/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
};
