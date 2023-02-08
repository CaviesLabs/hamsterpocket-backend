export enum Role {
  User = 'ROLE::USER',
  Admin = 'ROLE::ADMIN',
}

/**
 * UserRole for hamsterbox account.
 */
export enum UserGroup {
  Gamer = '/gamer',
  Partner = '/partner',
}

/**
 * Keycloak user info.
 */
export class UserEntity {
  id: number;

  email?: string;

  emailVerified?: boolean;

  birthday?: Date;

  displayName?: string;

  avatar?: string;

  roles: Role[];

  groups?: UserGroup[];

  telegram?: string;

  twitter?: string;
}
