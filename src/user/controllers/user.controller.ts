import { Controller, Body, Patch, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { CurrentSession } from '../../auth/decorators/current-session.decorator';
import { CommonApiResponse, CommonResponse } from '../../api-docs/api-response.decorator';
import { JwtAuthSession } from '../../auth/strategies/jwt.strategy';

@Controller({ path: 'user', version: '1' })
@ApiTags('user')
@ApiBearerAuth('jwt')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user profile successfully',
    type: UserEntity,
  })
  @CommonApiResponse(
    CommonResponse.UNAUTHORIZED_SESSION,
    CommonResponse.FORBIDDEN_SESSION,
    CommonResponse.WRONG_FIELD_FORMATS,
  )
  @UseGuards(AuthGuard('jwt'))
  @Patch('/profile')
  @HttpCode(HttpStatus.OK)
  public async updateUserProfile(@CurrentSession() { user }: JwtAuthSession, @Body() updateUserDto: UpdateUserDto) {
    /**
     * Update profile and return updated profile.
     */
    return this.userService.updateUserProfile(user.id, updateUserDto);
  }
}
