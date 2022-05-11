import { ID_PARAM } from './../url-params.constants';

export const USERS = {
  USERS_LIST: { path: `users` },
  USER_CREATE: { path: `users/new`, shortPath: `new` },
  USER_DETAIL: {
    path: `users/detail/${ID_PARAM}`,
    shortPath: `detail/${ID_PARAM}`,
  },
};
