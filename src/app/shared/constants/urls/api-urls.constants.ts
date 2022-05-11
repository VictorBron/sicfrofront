import { URLDef } from '../../models/api-URL.model';
import { CLIENTS_API } from './api-component-url/api-clients-url.constants';
import { DRIVERS_API } from './api-component-url/api-drivers-url.constants';
import { LOGIN_API } from './api-component-url/api-login-url.constants';
import { REQUESTS_API } from './api-component-url/api-requests-url.constants';
import { SCHEDULES_API } from './api-component-url/api-schedules-url.constants';
import { USERS_API } from './api-component-url/api-users-url.constants';
import { VEHICLES_API } from './api-component-url/api-vehicles-url.constants';

export const API_URLS: URLDef = {
  ...LOGIN_API,
  ...VEHICLES_API,
  ...REQUESTS_API,
  ...DRIVERS_API,
  ...CLIENTS_API,
  ...USERS_API,
  ...SCHEDULES_API,
};
