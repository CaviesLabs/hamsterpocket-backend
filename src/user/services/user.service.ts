import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserModel } from '../../orm/model/user.model';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userRepo.save(createUserDto);
  }

  public async updateUserProfile(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const isTaken = await this.userRepo.exist({
        where: { email: updateUserDto.email, id: Not(id) },
      });

      if (isTaken) {
        throw new ConflictException('USER::EMAIL_EXISTS');
      }
    }

    const { affected } = await this.userRepo.update({ id }, updateUserDto);
    if (affected == 0) {
      throw new NotFoundException('USER::NOT_FOUND');
    }
  }
}
