import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { StatisticsEntity } from '../../statistics/entities/statistics.entity';
import { BaseModel } from '../base.model';

@Injectable()
@Schema({ collection: 'statistics', timestamps: true })
export class StatisticsModel extends BaseModel implements StatisticsEntity {
  @Prop({ type: Number })
  users: number;

  @Prop({ type: Number })
  pockets: number;

  @Prop({ type: Number })
  totalVolume: number;
}

/**
 * @dev Trigger create schema.
 */
export const StatisticsSchema = SchemaFactory.createForClass(StatisticsModel);

/**
 * @dev Define generic type for typescript reference.
 */
export type StatisticsDocument = Document & StatisticsEntity;
