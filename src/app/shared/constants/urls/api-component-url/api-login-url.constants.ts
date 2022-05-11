import { URLDef } from '../../../models/api-URL.model';

export const LOGIN_API: URLDef = {
  LOGIN: {
    key: 'LOGIN',
    path: 'login/Auth',
  },
  REQUEST_TOKEN: {
    key: 'REQUEST_TOKEN',
    path: 'recover/token',
    params: {
      email: {
        key: 'email',
        value: '',
      },
    },
  },
  CHANGE_PASS: {
    key: 'CHANGE_PASS',
    path: 'recover/validate',
  },
};
