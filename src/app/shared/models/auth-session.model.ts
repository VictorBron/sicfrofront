export interface AuthSession {
  RequestedAt?: Date;
  TimeExpiration?: number;
  TokenCode?: string;
  PermissionLevel?: string;
  User?: string;
  LoginName?: string;
  Code?: number;
}
