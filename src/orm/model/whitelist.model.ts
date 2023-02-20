import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  EntityType,
  WhitelistEntity,
} from '../../whitelist/entities/whitelist.entity';
import { BaseModel } from '../base.model';

@Schema({ collection: 'whitelists' })
export class WhitelistModel extends BaseModel implements WhitelistEntity {
  id: string;

  @Prop({ type: String })
  coinGeckoId: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String, enum: EntityType })
  entityType: EntityType;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  symbol: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Number })
  decimals: number;

  @Prop({ type: Number })
  estimatedValue: number;
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