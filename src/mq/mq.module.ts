import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { POOL_QUEUE } from '../pool/queues/pool.processor';

@Module({
  imports: [BullModule.registerQueue({ name: POOL_QUEUE })],
  exports: [BullModule],
})
export class MqModule {}
