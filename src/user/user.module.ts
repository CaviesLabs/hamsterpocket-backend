import { Module } from '@nestjs/common';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { OrmModule } from '../orm/orm.module';
import { RegistryProvider } from '../providers/registry.provider';
import { AuthChallengeService } from '../auth/services/auth-challenge.service';
import { TokenIssuerService } from '../auth/services/token-issuer.service';
import { JwtProvider } from '../providers/hash/jwt.provider';
import { AuthSessionService } from '../auth/services/auth-session.service';
import { AvatarProvider } from '../providers/avatar.provider';
import { JwtAuthStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  /**
   * Import modules
   */
  imports: [OrmModule],
  /**
   * Import controllers.
   */
  controllers: [UserController],
  /**
   * Import providers
   */
  providers: [
    /**
     * Import providers
     */
    RegistryProvider,
    JwtProvider,
    AvatarProvider,
    /**
     * Import services
     */
    UserService,
    AuthChallengeService,
    TokenIssuerService,
    AuthSessionService,
    /**
     * Import strategies
     */
    JwtAuthStrategy,
    /**
     * Import guards.
     */
  ],
})
export class UserModule {}
