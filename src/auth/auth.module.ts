import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

/** Import providers */
import { AuthController } from './controllers/auth.controller';
import { JwtProvider } from '../providers/hash/jwt.provider';
import { SolanaIdentityProvider } from '../providers/solana-identity.provider';
import { BCryptHashProvider } from '../providers/hash/hashing.provider';
import { RegistryProvider } from '../providers/registry.provider';
import { AvatarProvider } from '../providers/avatar.provider';

/** Import modules */
import { OrmModule } from '../orm/orm.module';

/** Import services */
import { JwtAuthStrategy } from './strategies/jwt.strategy';
import { UserService } from '../user/services/user.service';
import { TokenIssuerService } from './services/token-issuer.service';
import { AuthChallengeService } from './services/auth-challenge.service';
import { AuthSessionService } from './services/auth-session.service';
import { SolanaAuthService } from './services/solana-auth.service';

@Module({
  imports: [
    /**
     * import ORM modules so that we can use models.
     */
    OrmModule,
    /**
     * Configure nestjs passport jwt module.
     */
    JwtModule.registerAsync({
      /**
       * Define module factory.
       */
      useFactory: async () => {
        /**
         * Use jwtService to extract metadata.
         */
        const jwtService = new JwtProvider(new RegistryProvider());

        /**
         * Binding credentials for jwt signing and verifying.
         */
        const options: JwtModuleOptions = {
          secret: jwtService.getKeyPair().privateKey,
          privateKey: jwtService.getKeyPair().privateKey,
          publicKey: jwtService.getKeyPair().publicKey,
          signOptions: jwtService.getSignOptions(),
        };

        /**
         * return options.
         */
        return options;
      },
    }),
  ],
  providers: [
    /**
     * Import providers.
     */
    RegistryProvider,
    JwtProvider,
    BCryptHashProvider,
    AvatarProvider,
    SolanaIdentityProvider,
    /**
     * Import strategy
     */
    JwtAuthStrategy,
    /**
     * Import services
     */
    TokenIssuerService,
    UserService,
    AuthChallengeService,
    AuthSessionService,
    SolanaAuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
