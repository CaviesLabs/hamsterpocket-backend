// eslint-disable-next-line
import * as Nacl from 'tweetnacl';
import * as Bs from 'bs58';

type SolanaSignatureData = {
  rawMessage: string;
  signature: string;
  walletAddress: string;
};

export class SolanaIdentityProvider {
  verifySignature({ rawMessage, signature, walletAddress }: SolanaSignatureData): boolean {
    return Nacl.sign.detached.verify(
      new TextEncoder().encode(rawMessage), // UTF-8
      Bs.decode(signature), // Base58
      Bs.decode(walletAddress), // Base58
    );
  }
}
