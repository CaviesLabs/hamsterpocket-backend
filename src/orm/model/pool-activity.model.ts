import { Injectable } from '@nestjs/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '../../pool/entities/pool-activity.entity';
import { BaseModel } from '../base.model';

@Injectable()
@Schema({ collection: 'pool_activities', timestamps: false })
export class PoolActivityModel extends BaseModel implements PoolActivityEntity {
  @Prop({ type: Types.ObjectId })
  poolId: Types.ObjectId;

  @Prop({ type: String, enum: PoolActivityStatus })
  status: PoolActivityStatus;

  @Prop({ type: String, enum: ActivityType })
  type: ActivityType;

  @Prop({ type: Number })
  baseTokenAmount: number;

  @Prop({ type: Number })
  targetTokenAmount: number;

  @Prop({ type: String })
  transactionId: string;

  @Prop({ type: String })
  memo: string;
}

/**
 * @dev Trigger create schema.
 */
export const PoolActivitySchema =
  SchemaFactory.createForClass(PoolActivityModel);

/**
 * @dev Define generic type for typescript reference.
 */
export type PoolActivityDocument = Document & PoolActivityEntity;
