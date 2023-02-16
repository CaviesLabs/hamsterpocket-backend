import { Injectable } from '@nestjs/common';
import { Schema, Prop } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '../../pool/entities/pool-activity.entity';
import { BaseModel } from '../base.model';

@Injectable()
@Schema({ collection: 'pool_activities', timestamps: true })
export class PoolActivityModel extends BaseModel implements PoolActivityEntity {
  @Prop({ type: Types.ObjectId })
  poolId: ObjectId;

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
