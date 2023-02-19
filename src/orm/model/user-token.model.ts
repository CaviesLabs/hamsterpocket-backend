import { Prop, SchemaFactory } from '@nestjs/mongoose';

import { UserTokenEntity } from '../../portfolio/entities/user-token.entity';
import { BaseModel } from '../base.model';

export class UserTokenModel extends BaseModel implements UserTokenEntity {
  @Prop({ type: String, required: true })
  ownerAddress: string;

  @Prop({ type: String, required: true })
  tokenAddress: string;

  @Prop({ type: String, required: true })
  tokenName: string;

  @Prop({ type: String, required: true })
  tokenSymbol: string;

  @Prop({ type: Number, default: 0 })
  total: number;
}

/**
 * @dev Trigger create schema.
 */
export const UserTokenSchema = SchemaFactory.createForClass(UserTokenModel);

/**
 * @dev Trigger create index if not exists
 */
/** Search index */
UserTokenSchema.index(
  { tokenName: 'text', tokenAddress: 'text' },
  { background: true },
);
/** Sort indexes */
UserTokenSchema.index({ total: 'desc' }, { background: true });

/**
 * @dev Define generic type for typescript reference.
 */
export type UserTokenDocument = Document & UserTokenEntity;
