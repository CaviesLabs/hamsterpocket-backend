import { Injectable } from '@nestjs/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '@/pool/entities/pool-activity.entity';
import { BaseModel } from '../base.model';
import { ChainID } from '@/pool/entities/pool.entity';

@Injectable()
@Schema({ collection: 'pool_activities', timestamps: false, autoIndex: true })
export class PoolActivityModel extends BaseModel implements PoolActivityEntity {
  @Prop({ type: String, enum: ChainID, default: ChainID.Solana })
  chainId: ChainID;

  @Prop({ type: Types.ObjectId })
  poolId: Types.ObjectId;

  @Prop({ type: String, required: false })
  actor?: string;

  @Prop({ type: String, enum: PoolActivityStatus })
  status: PoolActivityStatus;

  @Prop({ type: String, enum: ActivityType })
  type: ActivityType;

  @Prop({ type: Number, required: false })
  baseTokenAmount?: number;

  @Prop({ type: Number, required: false })
  targetTokenAmount?: number;

  @Prop({ type: String })
  transactionId: string;

  @Prop({ type: String })
  memo: string;

  @Prop({ type: String })
  eventHash: string;

  @Prop({ type: Date })
  createdAt: Date;
}

/**
 * @dev Trigger create schema.
 */
export const PoolActivitySchema =
  SchemaFactory.createForClass(PoolActivityModel);

PoolActivitySchema.index({ actor: 'text', poolId: 'text' });
PoolActivitySchema.index({ eventHash: 'desc' }, { unique: true, sparse: true });

/**
 * @dev Define generic type for typescript reference.
 */
export type PoolActivityDocument = Document & PoolActivityEntity;
