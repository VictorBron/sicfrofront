import { URLDef } from '../../../models/api-URL.model';

export const USERS_API: URLDef = {
  GET_USERS: {
    key: 'GET_USERS',
    path: 'user/users',
  },
  CREATE_USER: {
    key: 'CREATE_USER',
    path: 'user/users',
  },
  UPDATE_USER: {
    key: 'UPDATE_USER',
    path: 'user/user/{id}',
  },
  EDIT_USER_BY_ID: {
    key: 'EDIT_USER_BY_ID',
    path: 'user/user/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  GET_USER_BY_ID: {
    key: 'GET_USER_BY_ID',
    path: 'user/user/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
  DELETE_USER: {
    key: 'DELETE_USER',
    path: 'user/user/{id}',
    params: {
      id: {
        key: 'id',
        value: '',
      },
    },
  },
};
