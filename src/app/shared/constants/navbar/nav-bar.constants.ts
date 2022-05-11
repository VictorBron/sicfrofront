import { NavBarLink } from '../../components';
import { PERMISSIONS } from '../common';
import { APP_URLS } from '../urls';

export const NAV_BAR_LINKS: NavBarLink[] = [
  {
    name: 'NAVBAR.SCHEDULES',
    path: APP_URLS.SCHEDULES_LIST.path,
    permissions: [PERMISSIONS.SCHEDULE.READ],
  },
  {
    name: 'NAVBAR.REQUESTS',
    path: APP_URLS.REQUESTS_LIST.path,
    permissions: [PERMISSIONS.REQUEST.READ],
  },
  {
    name: 'NAVBAR.VEHICLES',
    path: APP_URLS.VEHICLES_LIST.path,
    permissions: [PERMISSIONS.VEHICLE.READ],
  },
  { name: 'NAVBAR.DRIVERS', path: APP_URLS.DRIVERS_LIST.path, permissions: [PERMISSIONS.DRIVER.READ] },
  { name: 'NAVBAR.CLIENTS', path: APP_URLS.CLIENTS_LIST.path, permissions: [PERMISSIONS.CLIENT.READ] },
  { name: 'NAVBAR.USERS', path: APP_URLS.USERS_LIST.path, permissions: [PERMISSIONS.USER.READ] },
];
