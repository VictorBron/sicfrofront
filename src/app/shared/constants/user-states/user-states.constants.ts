import { State } from '../../models';
export const USER_ACTIVE = true;
export const USER_BLOCKED = false;
export const USER_STATES: State[] = [
  { State: 'Activo', IdState: USER_ACTIVE },
  { State: 'Bloqueado', IdState: USER_BLOCKED },
];
