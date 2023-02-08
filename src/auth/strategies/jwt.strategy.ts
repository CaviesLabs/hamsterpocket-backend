import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Import deps.
 */
import { JWTPayload, JwtProvider } from '../../providers/hash/jwt.provider';
import { RegistryProvider } from '../../providers/registry.provider';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthSessionModel } from '../../orm/model/auth-session.model';
import { UserModel } from '../../orm/model/user.model';
import { AuthSessionService } from '../services/auth-session.service';

/**
 * Declare the application native jwt auth session.
 */
export type JwtAuthSession = {
  user: UserEntity;
  session: AuthSessionModel;
  jwtPayload: JWTPayload;
};

/**
 * Declare the Jwt Passport strategy.
 */
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  /**
   * Initialize passport strategy.
   * @param jwtOptions
   * @param cookieService
   * @param registryProvider
   * @param sessionService
   * @param ExtendedSessionRepo
   * @param UserRepo
   */
  constructor(
    private readonly registryProvider: RegistryProvider,
    private readonly jwtOptions: JwtProvider,
    private readonly authSessionService: AuthSessionService,
    @InjectRepository(UserModel)
    private readonly UserRepo: Repository<UserModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: jwtOptions.getKeyPair().publicKey,
      algorithms: jwtOptions.getVerifyOptions().algorithms,
    });
  }

  private async validateJwtSession(jwtPayload: JWTPayload): Promise<JwtAuthSession> {
    /**
     * Make sure the jwt id matched with a session id.
     */
    const session = await this.authSessionService.findAuthSessionById(jwtPayload.sid as number);
    if (!session) throw new UnauthorizedException();

    /**
     * Make sure the checksum is matched.
     */
    if (jwtPayload.sub !== session.checksum) throw new UnauthorizedException();

    /**
     * Make sure the user existed in the database.
     */
    const user = await this.UserRepo.findOne({
      where: { id: session.actorId },
    });
    if (!user) throw new UnauthorizedException();

    /**
     * Make sure the session is not expired
     */
    if (new Date().getTime() >= new Date(session.expiryDate).getTime()) {
      throw new UnauthorizedException();
    }

    /**
     * Make sure the jwt was issued for the right authorized party.
     */
    if (jwtPayload.azp !== this.registryProvider.getConfig().DOMAIN) {
      throw new UnauthorizedException();
    }

    /**
     * Returns session, user, jwt payload.
     * Will be request.user as passport default
     */
    return { session, user, jwtPayload };
  }

  /**
   * Validate jwt session. Main method.
   * @param payload
   */
  validate(payload: JWTPayload): Promise<JwtAuthSession> {
    return this.validateJwtSession(payload);
  }
}
