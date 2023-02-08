import { SystemId } from '../../core/primitive.core';

export class AuthSessionEntity {
  id: number;

  uid: string;

  authorizedPartyId: string;

  actorId: SystemId;

  expiryDate: Date;

  /**
   * Checksum hash of authorizedPartyId + actorId + expiryDate
   */
  checksum: string;
}
