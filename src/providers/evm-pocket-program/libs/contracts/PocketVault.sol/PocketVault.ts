/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace Params {
  export type UpdatePocketDepositParamsStruct = {
    actor: PromiseOrValue<string>;
    id: PromiseOrValue<string>;
    amount: PromiseOrValue<BigNumberish>;
    tokenAddress: PromiseOrValue<string>;
  };

  export type UpdatePocketDepositParamsStructOutput = [
    string,
    string,
    BigNumber,
    string
  ] & { actor: string; id: string; amount: BigNumber; tokenAddress: string };

  export type UpdatePocketWithdrawalParamsStruct = {
    actor: PromiseOrValue<string>;
    id: PromiseOrValue<string>;
  };

  export type UpdatePocketWithdrawalParamsStructOutput = [string, string] & {
    actor: string;
    id: string;
  };
}

export interface PocketVaultInterface extends utils.Interface {
  functions: {
    "closePosition(string,uint256)": FunctionFragment;
    "deposit((address,string,uint256,address))": FunctionFragment;
    "etherman()": FunctionFragment;
    "getCurrentQuote(address,address,uint256,uint256)": FunctionFragment;
    "initEtherman()": FunctionFragment;
    "initialize()": FunctionFragment;
    "makeDCASwap(string,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "permit2()": FunctionFragment;
    "quoter()": FunctionFragment;
    "registry()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setEtherman(address)": FunctionFragment;
    "setPermit2(address)": FunctionFragment;
    "setQuoter(address)": FunctionFragment;
    "setRegistry(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unpause()": FunctionFragment;
    "withdraw((address,string))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "closePosition"
      | "deposit"
      | "etherman"
      | "getCurrentQuote"
      | "initEtherman"
      | "initialize"
      | "makeDCASwap"
      | "owner"
      | "pause"
      | "paused"
      | "permit2"
      | "quoter"
      | "registry"
      | "renounceOwnership"
      | "setEtherman"
      | "setPermit2"
      | "setQuoter"
      | "setRegistry"
      | "transferOwnership"
      | "unpause"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "closePosition",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [Params.UpdatePocketDepositParamsStruct]
  ): string;
  encodeFunctionData(functionFragment: "etherman", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getCurrentQuote",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initEtherman",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "makeDCASwap",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(functionFragment: "permit2", values?: undefined): string;
  encodeFunctionData(functionFragment: "quoter", values?: undefined): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEtherman",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPermit2",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setQuoter",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setRegistry",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [Params.UpdatePocketWithdrawalParamsStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "closePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "etherman", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentQuote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initEtherman",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "makeDCASwap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "permit2", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "quoter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEtherman",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPermit2", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setQuoter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "ClosedPosition(address,string,address,uint256,address,uint256,uint256)": EventFragment;
    "Deposited(address,string,address,uint256,uint256)": EventFragment;
    "EthermanUpdated(address,address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "Permit2Updated(address,address)": EventFragment;
    "QuoterUpdated(address,address)": EventFragment;
    "RegistryUpdated(address,address)": EventFragment;
    "SwapFeeUpdated(address,uint256)": EventFragment;
    "Swapped(address,string,address,uint256,address,uint256,uint256)": EventFragment;
    "Unpaused(address)": EventFragment;
    "Withdrawn(address,string,address,uint256,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ClosedPosition"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "EthermanUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Permit2Updated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "QuoterUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RegistryUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SwapFeeUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Swapped"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export interface ClosedPositionEventObject {
  actor: string;
  pocketId: string;
  baseTokenAddress: string;
  baseTokenAmount: BigNumber;
  targetTokenAddress: string;
  targetTokenAmount: BigNumber;
  timestamp: BigNumber;
}
export type ClosedPositionEvent = TypedEvent<
  [string, string, string, BigNumber, string, BigNumber, BigNumber],
  ClosedPositionEventObject
>;

export type ClosedPositionEventFilter = TypedEventFilter<ClosedPositionEvent>;

export interface DepositedEventObject {
  actor: string;
  pocketId: string;
  tokenAddress: string;
  amount: BigNumber;
  timestamp: BigNumber;
}
export type DepositedEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber],
  DepositedEventObject
>;

export type DepositedEventFilter = TypedEventFilter<DepositedEvent>;

export interface EthermanUpdatedEventObject {
  actor: string;
  ethermanAddress: string;
}
export type EthermanUpdatedEvent = TypedEvent<
  [string, string],
  EthermanUpdatedEventObject
>;

export type EthermanUpdatedEventFilter = TypedEventFilter<EthermanUpdatedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface Permit2UpdatedEventObject {
  actor: string;
  permit2: string;
}
export type Permit2UpdatedEvent = TypedEvent<
  [string, string],
  Permit2UpdatedEventObject
>;

export type Permit2UpdatedEventFilter = TypedEventFilter<Permit2UpdatedEvent>;

export interface QuoterUpdatedEventObject {
  actor: string;
  quoter: string;
}
export type QuoterUpdatedEvent = TypedEvent<
  [string, string],
  QuoterUpdatedEventObject
>;

export type QuoterUpdatedEventFilter = TypedEventFilter<QuoterUpdatedEvent>;

export interface RegistryUpdatedEventObject {
  actor: string;
  registry: string;
}
export type RegistryUpdatedEvent = TypedEvent<
  [string, string],
  RegistryUpdatedEventObject
>;

export type RegistryUpdatedEventFilter = TypedEventFilter<RegistryUpdatedEvent>;

export interface SwapFeeUpdatedEventObject {
  actor: string;
  value: BigNumber;
}
export type SwapFeeUpdatedEvent = TypedEvent<
  [string, BigNumber],
  SwapFeeUpdatedEventObject
>;

export type SwapFeeUpdatedEventFilter = TypedEventFilter<SwapFeeUpdatedEvent>;

export interface SwappedEventObject {
  actor: string;
  pocketId: string;
  baseTokenAddress: string;
  baseTokenAmount: BigNumber;
  targetTokenAddress: string;
  targetTokenAmount: BigNumber;
  timestamp: BigNumber;
}
export type SwappedEvent = TypedEvent<
  [string, string, string, BigNumber, string, BigNumber, BigNumber],
  SwappedEventObject
>;

export type SwappedEventFilter = TypedEventFilter<SwappedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface WithdrawnEventObject {
  actor: string;
  pocketId: string;
  baseTokenAddress: string;
  baseTokenAmount: BigNumber;
  targetTokenAddress: string;
  targetTokenAmount: BigNumber;
  timestamp: BigNumber;
}
export type WithdrawnEvent = TypedEvent<
  [string, string, string, BigNumber, string, BigNumber, BigNumber],
  WithdrawnEventObject
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface PocketVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PocketVaultInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    closePosition(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deposit(
      params: Params.UpdatePocketDepositParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    etherman(overrides?: CallOverrides): Promise<[string]>;

    getCurrentQuote(
      baseTokenAddress: PromiseOrValue<string>,
      targetTokenAddress: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initEtherman(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    makeDCASwap(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    permit2(overrides?: CallOverrides): Promise<[string]>;

    quoter(overrides?: CallOverrides): Promise<[string]>;

    registry(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setEtherman(
      ethermanAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPermit2(
      permit2Address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setQuoter(
      quoterAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRegistry(
      registryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      params: Params.UpdatePocketWithdrawalParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  closePosition(
    pocketId: PromiseOrValue<string>,
    fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deposit(
    params: Params.UpdatePocketDepositParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  etherman(overrides?: CallOverrides): Promise<string>;

  getCurrentQuote(
    baseTokenAddress: PromiseOrValue<string>,
    targetTokenAddress: PromiseOrValue<string>,
    amountIn: PromiseOrValue<BigNumberish>,
    fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initEtherman(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initialize(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  makeDCASwap(
    pocketId: PromiseOrValue<string>,
    fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  permit2(overrides?: CallOverrides): Promise<string>;

  quoter(overrides?: CallOverrides): Promise<string>;

  registry(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setEtherman(
    ethermanAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPermit2(
    permit2Address: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setQuoter(
    quoterAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRegistry(
    registryAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    params: Params.UpdatePocketWithdrawalParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    closePosition(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    deposit(
      params: Params.UpdatePocketDepositParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    etherman(overrides?: CallOverrides): Promise<string>;

    getCurrentQuote(
      baseTokenAddress: PromiseOrValue<string>,
      targetTokenAddress: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    initEtherman(overrides?: CallOverrides): Promise<void>;

    initialize(overrides?: CallOverrides): Promise<void>;

    makeDCASwap(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    permit2(overrides?: CallOverrides): Promise<string>;

    quoter(overrides?: CallOverrides): Promise<string>;

    registry(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setEtherman(
      ethermanAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPermit2(
      permit2Address: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setQuoter(
      quoterAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setRegistry(
      registryAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    withdraw(
      params: Params.UpdatePocketWithdrawalParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ClosedPosition(address,string,address,uint256,address,uint256,uint256)"(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      baseTokenAddress?: null,
      baseTokenAmount?: null,
      targetTokenAddress?: null,
      targetTokenAmount?: null,
      timestamp?: null
    ): ClosedPositionEventFilter;
    ClosedPosition(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      baseTokenAddress?: null,
      baseTokenAmount?: null,
      targetTokenAddress?: null,
      targetTokenAmount?: null,
      timestamp?: null
    ): ClosedPositionEventFilter;

    "Deposited(address,string,address,uint256,uint256)"(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      tokenAddress?: PromiseOrValue<string> | null,
      amount?: null,
      timestamp?: null
    ): DepositedEventFilter;
    Deposited(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      tokenAddress?: PromiseOrValue<string> | null,
      amount?: null,
      timestamp?: null
    ): DepositedEventFilter;

    "EthermanUpdated(address,address)"(
      actor?: PromiseOrValue<string> | null,
      ethermanAddress?: PromiseOrValue<string> | null
    ): EthermanUpdatedEventFilter;
    EthermanUpdated(
      actor?: PromiseOrValue<string> | null,
      ethermanAddress?: PromiseOrValue<string> | null
    ): EthermanUpdatedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "Permit2Updated(address,address)"(
      actor?: PromiseOrValue<string> | null,
      permit2?: PromiseOrValue<string> | null
    ): Permit2UpdatedEventFilter;
    Permit2Updated(
      actor?: PromiseOrValue<string> | null,
      permit2?: PromiseOrValue<string> | null
    ): Permit2UpdatedEventFilter;

    "QuoterUpdated(address,address)"(
      actor?: PromiseOrValue<string> | null,
      quoter?: PromiseOrValue<string> | null
    ): QuoterUpdatedEventFilter;
    QuoterUpdated(
      actor?: PromiseOrValue<string> | null,
      quoter?: PromiseOrValue<string> | null
    ): QuoterUpdatedEventFilter;

    "RegistryUpdated(address,address)"(
      actor?: PromiseOrValue<string> | null,
      registry?: PromiseOrValue<string> | null
    ): RegistryUpdatedEventFilter;
    RegistryUpdated(
      actor?: PromiseOrValue<string> | null,
      registry?: PromiseOrValue<string> | null
    ): RegistryUpdatedEventFilter;

    "SwapFeeUpdated(address,uint256)"(
      actor?: PromiseOrValue<string> | null,
      value?: null
    ): SwapFeeUpdatedEventFilter;
    SwapFeeUpdated(
      actor?: PromiseOrValue<string> | null,
      value?: null
    ): SwapFeeUpdatedEventFilter;

    "Swapped(address,string,address,uint256,address,uint256,uint256)"(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      baseTokenAddress?: null,
      baseTokenAmount?: null,
      targetTokenAddress?: null,
      targetTokenAmount?: null,
      timestamp?: null
    ): SwappedEventFilter;
    Swapped(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      baseTokenAddress?: null,
      baseTokenAmount?: null,
      targetTokenAddress?: null,
      targetTokenAmount?: null,
      timestamp?: null
    ): SwappedEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    "Withdrawn(address,string,address,uint256,address,uint256,uint256)"(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      baseTokenAddress?: null,
      baseTokenAmount?: null,
      targetTokenAddress?: null,
      targetTokenAmount?: null,
      timestamp?: null
    ): WithdrawnEventFilter;
    Withdrawn(
      actor?: PromiseOrValue<string> | null,
      pocketId?: null,
      baseTokenAddress?: null,
      baseTokenAmount?: null,
      targetTokenAddress?: null,
      targetTokenAmount?: null,
      timestamp?: null
    ): WithdrawnEventFilter;
  };

  estimateGas: {
    closePosition(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deposit(
      params: Params.UpdatePocketDepositParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    etherman(overrides?: CallOverrides): Promise<BigNumber>;

    getCurrentQuote(
      baseTokenAddress: PromiseOrValue<string>,
      targetTokenAddress: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initEtherman(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    makeDCASwap(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    permit2(overrides?: CallOverrides): Promise<BigNumber>;

    quoter(overrides?: CallOverrides): Promise<BigNumber>;

    registry(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setEtherman(
      ethermanAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPermit2(
      permit2Address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setQuoter(
      quoterAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRegistry(
      registryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      params: Params.UpdatePocketWithdrawalParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    closePosition(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      params: Params.UpdatePocketDepositParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    etherman(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCurrentQuote(
      baseTokenAddress: PromiseOrValue<string>,
      targetTokenAddress: PromiseOrValue<string>,
      amountIn: PromiseOrValue<BigNumberish>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initEtherman(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    makeDCASwap(
      pocketId: PromiseOrValue<string>,
      fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    permit2(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    quoter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setEtherman(
      ethermanAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPermit2(
      permit2Address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setQuoter(
      quoterAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRegistry(
      registryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      params: Params.UpdatePocketWithdrawalParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
