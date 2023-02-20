import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { POOL_QUEUE } from './queues/pool.queue';
import { PORTFOLIO_QUEUE } from './queues/portfolio.queue';

@Module({
  imports: [
    BullModule.registerQueue({ name: POOL_QUEUE }, { name: PORTFOLIO_QUEUE }),
  ],
  exports: [BullModule],
})
export class MqModule {}