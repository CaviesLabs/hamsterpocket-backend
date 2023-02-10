import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { PoolEntity } from '../../pool/entities/pool.entity';
import { BaseModel } from '../base.model';

@Schema({ collection: 'pools', timestamps: true, autoIndex: true })
export class PoolModel extends BaseModel implements PoolEntity {
  @Prop({ type: String, unique: true })
  mintAddress: string;

  @Prop({ type: Object, nullable: true })
  metadata: object;

  @Prop({ type: Boolean })
  isNft: boolean;
}

/**
 * @dev Trigger create schema.
 */
export const PoolSchema = SchemaFactory.createForClass(PoolModel);

/**
 * @dev Define generic type for typescript reference.
 */
export type PoolDocument = Document & PoolEntity;
