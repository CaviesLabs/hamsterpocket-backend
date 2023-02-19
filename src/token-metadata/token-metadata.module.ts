import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { NetworkProvider } from '../providers/network.provider';
import { TokenMetadataProvider } from '../providers/token-metadata.provider';
import { MetadataController } from './controllers/metadata.controller';
import { TokenMetadataService } from './services/token-metadata.service';

@Module({
  imports: [OrmModule],
  controllers: [MetadataController],
  providers: [NetworkProvider, TokenMetadataProvider, TokenMetadataService],
  exports: [TokenMetadataService],
})
export class TokenMetadataModule {}
