import { FrowardUserType } from '../models/froward-user-type.constant';

export const FROWARD_USER_TYPES: FrowardUserType[] = [
  {
    Type: 'Administrador',
    Permission: 'FROWARD_ADMIN',
  },
  {
    Type: 'Supervisor',
    Permission: 'FROWARD_SUPERVISOR',
  },
  {
    Type: 'Lector',
    Permission: 'FROWARD_READER',
  },
];
