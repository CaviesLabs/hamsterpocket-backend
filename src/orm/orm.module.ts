import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TokenMetadataModel,
  TokenMetadataSchema,
} from './model/token-metadata.model';

@Module({
  /**
   * @dev Declare models for the system to inject.
   */
  imports: [
    /**
     * @dev Use forFeature to declare models.
     */
    MongooseModule.forFeature([
      { name: TokenMetadataModel.name, schema: TokenMetadataSchema },
    ]),
  ],
  exports: [
    /**
     * @dev Need to re-export again the Mongoose module for re-use in other modules.
     */
    MongooseModule,
  ],
})
export class OrmModule {}
