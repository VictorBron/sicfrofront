import { DRIVERS } from './app-component-url/url-drivers.constants';
import { REQUESTS } from './app-component-url/url-requests.constants';
import { VEHICLES } from './app-component-url/url-vehicles.constants';
import { CLIENTS } from './app-component-url/url-clients.constants';
import { USERS } from './app-component-url/url-users.constants';
import { SCHEDULES } from './app-component-url/url-schedules.constants';
import { LOGIN } from './app-component-url/url-login.constants';

export const APP_URLS = {
  HOME: { path: 'schedules' },
  ...LOGIN,
  NOT_ALLOWED: { path: 'not-allowed' },
  ...VEHICLES,
  ...DRIVERS,
  ...REQUESTS,
  ...USERS,
  ...CLIENTS,
  ...SCHEDULES,
};
