/**
 * @dev Import native libraries
 */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Keypair } from '@solana/web3.js';
import * as Tws from 'tweetnacl';
import * as bs from 'bs58';

/**
 * @dev Import modules
 */
import { AppModule } from '../src/app.module';
import { globalApply } from '../src/main';
import { FastifyAdapter } from '@nestjs/platform-fastify';

/**
 * @dev Test helper to setup fixtures and other helpers.
 */
export class TestHelper {
  public app: INestApplication;
  public moduleFixture: TestingModule;

  /**
   * @dev Boot the app
   */
  public async bootTestingApp() {
    this.moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = this.moduleFixture.createNestApplication(new FastifyAdapter());
    await globalApply(this.app);

    await this.app.init();
    await this.app.getHttpAdapter().getInstance().ready();
    // import fixtures
    await this.applyFixtures();
  }

  /**
   * @dev Shutdown app
   */
  public async shutDownTestingApp() {
    await this.moduleFixture.close();
    await this.app.close();
  }

  /**
   * @dev Support creating Solana keypair.
   * @param keyPair
   */
  public createSolanaKeyPair() {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const sign = (message: string) => {
      const encodedMessage = new TextEncoder().encode(message);
      const signedData = Tws.sign.detached(encodedMessage, keypair.secretKey);
      return bs.encode(signedData);
    };
    return {
      sign,
      privateKey: keypair.secretKey,
      walletAddress: publicKey,
    };
  }

  /**
   * @dev Get module
   * @param moduleClass
   */
  public getModule<Module>(moduleClass) {
    return this.moduleFixture.get<Module>(moduleClass);
  }

  /**
   * @dev This function to setup fixtures.
   * @private
   */
  private async applyFixtures() {
    console.log('Start import fixtures');
  }
}
