import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime, Duration } from 'luxon';

import { TokenSetEntity } from '../entities/token-set.entity';
import { AuthSessionModel } from '../../orm/model/auth-session.model';
import { SystemId } from '../../core/primitive.core';

import { JWTPayload, JwtProvider } from '../../providers/hash/jwt.provider';
import { RegistryProvider } from '../../providers/registry.provider';
import { BCryptHashProvider } from '../../providers/hash/hashing.provider';

/**
 * The payload for generating access.
 */
export interface AccessTokenConfig {
  requestedResource: string;
  actorId: SystemId;
  authorizedPartyId: string;
  expiresIn: number; // milliseconds
  identityMethodId: number;
}

export interface GrantAccessTokenOptions {
  actorId: SystemId;
  identityMethodId: number;
  expiresIn?: Duration;
}

export const DEFAULT_TOKEN_DURATION = Duration.fromObject({ days: 7 });

@Injectable()
export class TokenIssuerService {
  constructor(
    @InjectRepository(AuthSessionModel)
    private readonly AuthSessionRepo: Repository<AuthSessionModel>,
    private readonly jwtProvider: JwtProvider,
    private readonly registryProvider: RegistryProvider,
  ) {}

  /**
   * The function to generate access jwt.
   * @param config
   */
  private async grantAccessToken(config: AccessTokenConfig): Promise<string> {
    /**
     * Calculate session expired time
     */
    const sessionExpiredAt = DateTime.now().plus({ milliseconds: config.expiresIn });
    /**
     * Calculate checksum by BCrypt.
     */
    const checksum = await new BCryptHashProvider().hash(
      JSON.stringify({
        actorId: config.actorId,
        authorizedPartyId: config.authorizedPartyId,
        expiryDate: sessionExpiredAt.toJSDate(),
      }),
    );

    /**
     * Create co-response session
     */
    const session = await this.AuthSessionRepo.save({
      actorId: config.actorId,
      authorizedPartyId: config.authorizedPartyId,
      expiryDate: sessionExpiredAt.toJSDate(),
      checksum,
    });

    const now = DateTime.now();
    /**
     * Sign and return
     */
    return this.jwtProvider.signJwt({
      /**
       * Fields to be verified
       */
      jti: session.uid,
      sid: session.id,
      sub: checksum,
      azp: config.authorizedPartyId,
      aud: config.requestedResource,
      exp: sessionExpiredAt.toSeconds(),
      iss: this.registryProvider.getConfig().DOMAIN,
      /**
       * Other fields.
       */
      iat: now.toSeconds(),
      typ: 'Bearer',
      nbf: now.toSeconds(),
    });
  }

  public async grantSignInAccessToken({
    actorId,
    identityMethodId,
    expiresIn = DEFAULT_TOKEN_DURATION,
  }: GrantAccessTokenOptions): Promise<TokenSetEntity> {
    return {
      accessToken: await this.grantAccessToken({
        actorId,
        expiresIn: expiresIn.toMillis(),
        authorizedPartyId: this.registryProvider.getConfig().DOMAIN,
        requestedResource: 'account',
        identityMethodId,
      }),
    };
  }

  /**
   * Introspect jwt token.
   */
  public async introspect(jwtToken: string): Promise<JWTPayload> {
    return this.jwtProvider.introspect(jwtToken);
  }
}
