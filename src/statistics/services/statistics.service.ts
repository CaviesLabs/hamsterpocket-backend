import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  StatisticsDocument,
  StatisticsModel,
} from '../../orm/model/statistic.model';

export class StatisticsService {
  constructor(
    @InjectModel(StatisticsModel.name)
    private readonly statisticsRepo: Model<StatisticsDocument>,
  ) {}

  getLatest() {
    return this.statisticsRepo.findOne({}, undefined, {
      sort: { createdAt: -1 },
    });
  }
}
