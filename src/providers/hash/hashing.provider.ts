import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as AES from 'aes-js';

/**
 * Hashing algorithm enum.
 */
export enum HashingAlgorithm {
  BCRYPT = 'bcrypt',
  RSA4096 = 'RSA-4096',
  AES = 'AES',
}

/**
 * Declare Encryptor interface.
 */
export interface Encryptor {
  /**
   * Encrypt content and return encrypted hash.
   * @param content
   */
  encrypt(content: string): string;

  /**
   * Decrypt encrypted content and return original content.
   * @param encryptedContent
   */
  decrypt(encryptedContent: string): string;
}

/**
 * Define Bcrypt hashing
 */
export class BCryptHashProvider {
  /**
   * Generate salt (secret key) for encryption.
   */
  genSalt: typeof bcrypt.genSalt = bcrypt.genSalt;

  /**
   * Compare hash.
   */
  compare: typeof bcrypt.compare = bcrypt.compare;

  /**
   * Hash content.
   * @param data
   */
  async hash(data: any): Promise<string> {
    const salt = await this.genSalt();
    return bcrypt.hash(data, salt);
  }
}

/**
 * RSA Hasher.
 * See reference: https://stackoverflow.com/questions/66335231/node-crypto-instead-of-jsencrypt-for-encryption-with-public-key
 */
export class RSAHashProvider {
  /**
   * Inject config service so that the provider can inject the env credentials
   * @param pkcs8Key
   * @param publicKey
   */
  constructor(private readonly pkcs8Key: string, private readonly publicKey: string) {}

  /**
   * Access credentials.
   */
  private getKeyPair() {
    return {
      privateKey: this.pkcs8Key,
      publicKey: this.publicKey,
    };
  }

  /**
   * Encryptor getter.
   * @private
   */
  private getEncryptor(): Encryptor {
    /**
     * Access Keypair.
     */
    const keypair = this.getKeyPair();

    /**
     * Return Encryptor object.
     */
    return {
      /**
       * Implement encrypt using public key function.
       * @param content
       */
      encrypt(content: string): string {
        /**
         * Using crypto.publicEncrypt with passed public key.
         */
        return crypto
          .publicEncrypt(
            {
              key: keypair.publicKey,
            },
            Buffer.from(content, 'utf-8'),
          )
          .toString('base64');
      },
      /**
       * Implement decrypt using private key function.
       * @param encryptedContent
       */
      decrypt(encryptedContent: string): string {
        /**
         * Using crypto.privateDecrypt with passed public key.
         */
        return crypto
          .privateDecrypt({ key: keypair.privateKey }, Buffer.from(encryptedContent, 'base64'))
          .toString('utf-8');
      },
    };
  }

  /**
   * Encrypt using public key.
   * @param content
   */
  public encrypt(content: string): Promise<string> {
    const encryptor = this.getEncryptor();
    /**
     * Return encrypted content.
     * Wrapped in a promise so that the operation can be asynchronous.
     */
    return new Promise<string>((resolve, reject) => {
      try {
        /**
         * Resolve encrypted content
         */
        return resolve(encryptor.encrypt(content) as string);
      } catch (e) {
        /**
         * Or raise error.
         */
        return reject(e);
      }
    });
  }

  /**
   * Decrypt using private key.
   * @param content
   */
  public decrypt(content: string): Promise<string> {
    const encryptor = this.getEncryptor();
    /**
     * Return encrypted content.
     * Wrapped in a promise so that the operation can be asynchronous.
     */
    return new Promise<string>((resolve, reject) => {
      try {
        /**
         * Resolve encrypted content
         */
        return resolve(encryptor.decrypt(content) as string);
      } catch (e) {
        /**
         * Or raise error.
         */
        return reject(e);
      }
    });
  }
}

/**
 * AES Hash Provider
 * See reference: https://github.com/ricmoo/aes-js/tree/typescript
 */
export class AESHashProvider {
  /**
   * AES Counter.
   * @private
   */
  private readonly counter = 10;

  /**
   * Inject config service so that the provider can inject the env credentials
   * @param secretKey Must be 256-bit hex encoded string.
   */
  constructor(private readonly secretKey: string) {}

  /**
   * Access credentials.
   */
  private getKeyPair() {
    return {
      secretKey: this.secretKey,
    };
  }

  /**
   * Encryptor getter.
   * @private
   */
  private getEncryptor(): Encryptor {
    /**
     * Access Keypair.
     */
    const keypair = this.getKeyPair();
    const counter = this.counter;
    /**
     * Return Encryptor object.
     */
    return {
      /**
       * Implement encrypt using public key function.
       * @param content The utf-8 encoded content.
       */
      encrypt(content: string): string {
        /**
         * Using AES to encrypt with secret token.
         */
        const encryptor = new AES.ModeOfOperation.ctr(
          AES.utils.hex.toBytes(keypair.secretKey),
          new AES.Counter(counter),
        );

        /**
         * Encrypt and get encrypted bytes.
         */
        const encryptedBytes = encryptor.encrypt(AES.utils.utf8.toBytes(content));

        /**
         * Convert encrypted bytes to hex.
         */
        return AES.utils.hex.fromBytes(encryptedBytes);
      },
      /**
       * Implement decrypt using secret token.
       * @param encryptedContent The hex encoded content.
       */
      decrypt(encryptedContent: string): string {
        /**
         * Using crypto.publicEncrypt with passed public key.
         */
        const encryptor = new AES.ModeOfOperation.ctr(
          AES.utils.hex.toBytes(keypair.secretKey),
          new AES.Counter(counter),
        );

        /**
         * Decrypt and get results in bytes.
         */
        const decryptedBytes = encryptor.decrypt(AES.utils.hex.toBytes(encryptedContent));

        /**
         * Convert decrypted bytes to utf-8 content again.
         */
        return AES.utils.utf8.fromBytes(decryptedBytes);
      },
    };
  }

  /**
   * Encrypt using public key.
   * @param content
   */
  public encrypt(content: string): Promise<string> {
    const encryptor = this.getEncryptor();
    /**
     * Return encrypted content.
     * Wrapped in a promise so that the operation can be asynchronous.
     */
    return new Promise<string>((resolve, reject) => {
      try {
        /**
         * Resolve encrypted content
         */
        return resolve(encryptor.encrypt(content) as string);
      } catch (e) {
        /**
         * Or raise error.
         */
        return reject(e);
      }
    });
  }

  /**
   * Decrypt using private key.
   * @param content
   */
  public decrypt(content: string): Promise<string> {
    const encryptor = this.getEncryptor();
    /**
     * Return encrypted content.
     * Wrapped in a promise so that the operation can be asynchronous.
     */
    return new Promise<string>((resolve, reject) => {
      try {
        /**
         * Resolve encrypted content
         */
        return resolve(encryptor.decrypt(content) as string);
      } catch (e) {
        /**
         * Or raise error.
         */
        return reject(e);
      }
    });
  }
}
