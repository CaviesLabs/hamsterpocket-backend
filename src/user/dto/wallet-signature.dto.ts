import { IsEthereumAddress, IsHexadecimal, IsString } from 'class-validator';

export class EVMWalletSignatureDto {
  /**
   * Desired wallet must be ETH address
   */
  @IsEthereumAddress()
  desiredWallet: string;

  @IsHexadecimal()
  signature: string;
}

export class SolanaWalletSignatureDto {
  @IsString()
  desiredWallet: string;

  @IsString()
  signature: string;
}
