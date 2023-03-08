import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import {
  ActivityModel,
  PoolActivityDocument,
} from '../../orm/model/pool-activity.model';
import { FindPoolActivityDto } from '../dtos/find-pool-activity.dto';

export class PoolActivityService {
  constructor(
    @InjectModel(ActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
  ) {}

  async find({}: // ownerAddress,
  // statuses,
  // timeTo,
  // timeFrom,
  // limit,
  // offset,
  // search,
  FindPoolActivityDto & CommonQueryDto) {
    const stages = [];
    return await this.poolActivityRepo.aggregate(stages);
  }
}
