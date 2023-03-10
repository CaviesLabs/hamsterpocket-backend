import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseModel } from '../base.model';
import { MarketEntity } from '../../whitelist/entities/market.entity';

@Injectable()
@Schema({ collection: 'market', timestamps: true, autoIndex: true })
export class MarketModel extends BaseModel implements MarketEntity {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  baseMint: string;

  @Prop({ type: String })
  quoteMint: string;

  @Prop({ type: String })
  lpMint: string;

  @Prop({ type: Number })
  baseDecimals: number;

  @Prop({ type: Number })
  quoteDecimals: number;

  @Prop({ type: Number })
  lpDecimals: number;

  @Prop({ type: Number })
  version: number;

  @Prop({ type: String })
  programId: string;

  @Prop({ type: String })
  authority: string;

  @Prop({ type: String })
  openOrders: string;

  @Prop({ type: String })
  targetOrders: string;

  @Prop({ type: String })
  baseVault: string;

  @Prop({ type: String })
  quoteVault: string;

  @Prop({ type: String })
  withdrawQueue: string;

  @Prop({ type: String })
  lpVault: string;

  @Prop({ type: Number })
  marketVersion: number;

  @Prop({ type: Number })
  minOrderSizeForBaseMint: number;

  @Prop({ type: String })
  marketProgramId: string;

  @Prop({ type: String })
  marketId: string;

  @Prop({ type: String })
  marketAuthority: string;

  @Prop({ type: String })
  marketBaseVault: string;

  @Prop({ type: String })
  marketQuoteVault: string;

  @Prop({ type: String })
  marketBids: string;

  @Prop({ type: String })
  marketAsks: string;

  @Prop({ type: String })
  marketEventQueue: string;

  @Prop({ type: String })
  lookupTableAccount: string;
}

/**
 * @dev Trigger create schema.
 */
export const MarketDataSchema = SchemaFactory.createForClass(MarketModel);

/**
 * @dev Trigger create index if not exists
 */
MarketDataSchema.index({ id: 'asc' }, { unique: true });
MarketDataSchema.index({ marketId: 'asc' }, { unique: true });
MarketDataSchema.index({
  baseMint: 'asc',
  quoteMint: 'asc',
});

/**
 * @dev Define generic type for typescript reference.
 */
export type MarketDataDocument = Document & MarketEntity;
