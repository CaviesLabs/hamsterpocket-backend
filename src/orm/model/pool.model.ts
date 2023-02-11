import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateTime, DurationObjectUnits } from 'luxon';
import { Document } from 'mongoose';

import {
  BuyCondition,
  PoolEntity,
  StopConditions,
} from '../../pool/entities/pool.entity';
import { BaseModel } from '../base.model';

@Schema({ collection: 'pools', timestamps: true, autoIndex: true })
export class PoolModel extends BaseModel implements PoolEntity {
  @Prop({ type: Number, default: () => DateTime.now().toMillis() })
  numberId: number;

  /** Enforce unique of docs with address field presented */
  @Prop({ type: String, unique: true, sparse: true })
  address: string;

  @Prop({ type: String })
  ownerAddress: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Number })
  paxAmount: number;

  @Prop({ type: Object })
  frequency: DurationObjectUnits;

  @Prop({ type: BuyCondition, required: false })
  buyCondition: BuyCondition;

  @Prop({ type: StopConditions, required: false })
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
