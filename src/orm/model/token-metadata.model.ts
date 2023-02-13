import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { TokenMetadataEntity } from '../../token-metadata/entities/token-metadata.entity';
import { BaseModel } from '../base.model';

@Injectable()
@Schema({ collection: 'token-metadata', timestamps: true, autoIndex: true })
export class TokenMetadataModel
  extends BaseModel
  implements TokenMetadataEntity
{
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
export const TokenMetadataSchema =
  SchemaFactory.createForClass(TokenMetadataModel);

/**
 * @dev Define generic type for typescript reference.
 */
export type TokenMetadataDocument = Document & TokenMetadataEntity;
