import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DurationObjectUnits } from 'luxon';
import { Document } from 'mongoose';

import {
  BuyCondition,
  PoolEntity,
  PoolStatus,
  StopConditions,
} from '../../pool/entities/pool.entity';
import { BaseModel } from '../base.model';

@Injectable()
@Schema({ collection: 'pools', timestamps: true, autoIndex: true })
export class PoolModel extends BaseModel implements PoolEntity {
  @Prop({ enum: PoolStatus })
  status: PoolStatus;

  @Prop()
  pair: string[];

  /** Enforce unique of docs with address field presented */
  @Prop({ type: String, unique: true, sparse: true })
  address: string;

  @Prop({ type: String })
  ownerAddress: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Number })
  batchAmount: number;

  @Prop({ type: Object })
  frequency: DurationObjectUnits;

  @Prop({ type: Object })
  buyCondition: BuyCondition;

  @Prop({ type: Object })
  stopConditions: StopConditions;
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

/**
 * @dev Define generic type for typescript reference.
 */
export type PoolDocument = Document & PoolEntity;
