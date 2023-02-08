import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { AuthChallengeModel } from '../../orm/model/auth-challenge.model';
import { MEMO_TEXT } from '../entities/auth-challenge.entity';

@Injectable()
export class AuthChallengeService {
  constructor(
    @InjectRepository(AuthChallengeModel)
    private readonly AuthChallengeRepo: Repository<AuthChallengeModel>,
  ) {}

  public async generateAuthChallenge(target: string, delta = 60): Promise<AuthChallengeModel> {
    return this.AuthChallengeRepo.save({
      target,
      expiryDate: DateTime.now().plus({ seconds: delta }).toJSDate(),
      isResolved: false,
      durationDelta: delta,
      memo: MEMO_TEXT,
    });
  }

  public async resolveAuthChallenge(authChallengeId: number) {
    const { affected } = await this.AuthChallengeRepo.update({ id: authChallengeId }, { isResolved: true });
    if (affected == 0) {
      throw new NotFoundException('Auth challenge not found');
    }
  }

  public async getLatestAuthChallenge(target: string): Promise<AuthChallengeModel | null> {
    return this.AuthChallengeRepo.findOne({
      where: {
        target,
        isResolved: false,
        expiryDate: MoreThan(new Date()),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
