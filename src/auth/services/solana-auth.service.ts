import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../../user/entities/user.entity';
import { MEMO_TEXT } from '../entities/auth-challenge.entity';
import { TokenSetEntity } from '../entities/token-set.entity';
import { IdentityMethodEntity, IdentityProvider } from '../entities/identity-method.entity';
import { SolanaLoginDto } from '../dto/solana-login.dto';
import { UserService } from '../../user/services/user.service';
import { AuthChallengeService } from './auth-challenge.service';
import { TokenIssuerService } from './token-issuer.service';
import { IdentityMethodModel } from '../../orm/model/identity-method.model';
import { SolanaIdentityProvider } from '../../providers/solana-identity.provider';

@Injectable()
export class SolanaAuthService {
  constructor(
    private readonly solanaIdentityProvider: SolanaIdentityProvider,
    private readonly authChallengeService: AuthChallengeService,
    private readonly tokenIssuerService: TokenIssuerService,
    private readonly userService: UserService,
    @InjectRepository(IdentityMethodModel)
    private readonly identityMethodRepo: Repository<IdentityMethodModel>,
  ) {}

  async signIn({ authChallengeId, signature, desiredWallet }: SolanaLoginDto): Promise<TokenSetEntity> {
    /**
     * Verify the signature.
     */
    const isVerified = this.solanaIdentityProvider.verifySignature({
      rawMessage: MEMO_TEXT,
      signature: signature,
      walletAddress: desiredWallet,
    });
    if (!isVerified) {
      throw new UnauthorizedException();
    }

    const { id, userId } = await this.findOrCreateNewUserWithIdentityMethod(desiredWallet);

    /**
     * Resolve the auth challenge.
     */
    await this.authChallengeService.resolveAuthChallenge(authChallengeId);

    return this.tokenIssuerService.grantSignInAccessToken({
      actorId: userId,
      identityMethodId: id,
    });
  }

  async findOrCreateNewUserWithIdentityMethod(walletAddress: string): Promise<IdentityMethodEntity> {
    const existedMethod = await this.identityMethodRepo.findOneBy({
      Identity: walletAddress,
      provider: IdentityProvider.SOLANA,
    });
    if (existedMethod) {
      return existedMethod;
    }

    const user = await this.userService.createUser({ roles: [Role.User] });

    return this.identityMethodRepo.save({
      userId: user.id,
      provider: IdentityProvider.SOLANA,
      Identity: walletAddress,
    });
  }
}
