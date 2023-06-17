import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseModel } from '../base.model';
import { ChainID } from '../../pool/entities/pool.entity';
import { SyncStatusEntity } from '../../pool/entities/sync-status.entity';

@Injectable()
@Schema({ collection: 'sync_status', timestamps: false, autoIndex: true })
export class SyncStatusModel extends BaseModel implements SyncStatusEntity {
  id: string;

  @Prop({ type: String, enum: ChainID, default: ChainID.BSC })
  chainId: ChainID;

  @Prop({ type: Number })
  syncedBlock: number;

  @Prop({ type: Number })
  blockDiff: number;

  @Prop({ type: Number })
  startingBlock: number;
}

/**
 * @dev Trigger create schema.
 */
export const SyncStatusSchema = SchemaFactory.createForClass(SyncStatusModel);

/**
 * @dev Define generic type for typescript reference.
 */
export type SyncStatusDocument = Document & SyncStatusEntity;
