import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Import models.
 */
import { AuthChallengeModel } from './model/auth-challenge.model';
import { AuthSessionModel } from './model/auth-session.model';
import { IdentityMethodModel } from './model/identity-method.model';
import { UserModel } from './model/user.model';

@Module({
  /**
   * Declare models for the system to inject.
   */
  imports: [
    /**
     * Use forFeature to declare models.
     */
    TypeOrmModule.forFeature([AuthSessionModel, AuthChallengeModel, UserModel, IdentityMethodModel]),
  ],
  exports: [
    /**
     * Need to re-export again the Mongoose module for re-use in other modules.
     */
    TypeOrmModule,
  ],
})
export class OrmModule {}
