import { Client } from '../../clients/models';

export interface User {
  IdUser?: number;
  Client?: Client;
  Login?: string;
  Name?: string;
  LastName?: string;
  Telephone?: string;
  Email?: string;
  LastEntry?: Date;
  Active?: boolean;
  Password?: string;
  Permissions?: string;
  ClientIdClient?: number;
  RUT?: string;
  FrowardType?: string;
}
