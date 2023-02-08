/**
 * Import base Auth entity.
 */
import { AuthChallengeEntity, MEMO_TEXT } from '../../auth/entities/auth-challenge.entity';
import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from '../base.model';

@Entity({ name: 'auth_challenge' })
@Index('target_createdAt_idx', ['target', 'createdAt'])
export class AuthChallengeModel extends BaseModel implements AuthChallengeEntity {
  @Column({ type: String })
  target: string;

  @Column({ type: String })
  memo: typeof MEMO_TEXT;

  @Column({ type: 'timestamptz' })
  expiryDate: Date;

  @Column({ type: Boolean })
  isResolved: boolean;

  @Column({ type: Number })
  durationDelta: number;
}
