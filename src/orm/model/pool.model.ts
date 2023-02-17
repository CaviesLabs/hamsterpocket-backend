import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DurationObjectUnits } from 'luxon';
import { Document } from 'mongoose';

import {
  BuyCondition,
  MainProgressBy,
  PoolEntity,
  PoolStatus,
  StopConditions,
} from '../../pool/entities/pool.entity';
import { BaseModel } from '../base.model';

@Injectable()
@Schema({ collection: 'pools', timestamps: true })
export class PoolModel extends BaseModel implements PoolEntity {
  @Prop({ type: String, enum: PoolStatus })
  status: PoolStatus;

  @Prop({ type: String, required: true })
  baseTokenAddress: string;

  @Prop({ type: String, required: true })
  targetTokenAddress: string;

  /** Enforce unique of docs with address field presented */
  @Prop({ type: String, unique: true, sparse: true })
  address: string;

  @Prop({ type: String })
  ownerAddress: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Number, default: 0 })
  depositedAmount: number;

  @Prop({ type: Number })
  batchVolume: number;

  @Prop({ type: Object })
  frequency: DurationObjectUnits;

  @Prop({ type: Object })
  buyCondition: BuyCondition | undefined;

  /** Must default Null to easy query */
  @Prop({ type: Object, default: null })
  stopConditions: StopConditions | undefined;

  /**
   * Progression fields
   */
  @Prop({ type: Number, default: 0 })
  currentBaseToken: number;

  @Prop({ type: Number, default: 0 })
  remainingBaseTokenBalance: number;

  @Prop({ type: Number, default: 0 })
  currentTargetToken: number;

  @Prop({ type: Number, default: 0 })
  currentBatchAmount: number;

  @Prop({ type: String, default: null })
  mainProgressBy: MainProgressBy | undefined;

  @Prop({ type: Number, default: 0 })
  progressPercent: number;
}

/**
 * @dev Trigger create schema.
 */
export const PoolSchema = SchemaFactory.createForClass(PoolModel);

/**
 * @dev Trigger create index if not exists
 */
/** Search index */
PoolSchema.index({ address: 'text', name: 'text' }, { background: true });
/** Sort indexes */
PoolSchema.index({ startTime: 'desc' }, { background: true });
PoolSchema.index({ createdAt: 'desc' }, { background: true });
PoolSchema.index({ progressPercent: 'desc' }, { background: true });

/**
 * @dev Define generic type for typescript reference.
 */
export type PoolDocument = Document & PoolEntity;
