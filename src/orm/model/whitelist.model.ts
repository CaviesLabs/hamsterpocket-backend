import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChainID } from '@/pool/entities/pool.entity';
import {
  EntityType,
  WhitelistEntity,
} from '@/whitelist/entities/whitelist.entity';
import { BaseModel } from '../base.model';

@Schema({ collection: 'whitelists' })
export class WhitelistModel extends BaseModel implements WhitelistEntity {
  id: string;

  @Prop({ type: String, enum: ChainID })
  chainId: ChainID;

  @Prop({ type: String, unique: true })
  address: string;

  @Prop({ type: String, enum: EntityType })
  entityType: EntityType;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  coingeckoId: string;

  @Prop({ type: String })
  symbol: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Number })
  decimals: number;

  @Prop({ type: Number })
  estimatedValue: number;

  @Prop({ type: Boolean })
  isNativeCoin: boolean;
}

/**
 * @dev Trigger create schema.
 */
export const WhitelistSchema = SchemaFactory.createForClass(WhitelistModel);

/**
 * @dev Trigger create index if not exists
 */
WhitelistSchema.index({ address: 'asc' });
WhitelistSchema.index({ entityType: 'asc' });

/**
 * @dev Define generic type for typescript reference.
 */
export type WhitelistDocument = Document & WhitelistEntity;
