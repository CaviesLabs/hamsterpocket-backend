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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface UniversalRouterInterface extends utils.Interface {
  functions: {
    "execute(bytes,bytes[])": FunctionFragment;
    "execute(bytes,bytes[],uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "execute(bytes,bytes[])"
      | "execute(bytes,bytes[],uint256)"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "execute(bytes,bytes[])",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "execute(bytes,bytes[],uint256)",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>[],
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "execute(bytes,bytes[])",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "execute(bytes,bytes[],uint256)",
    data: BytesLike
  ): Result;

  events: {};
}

export interface UniversalRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UniversalRouterInterface;

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
    "execute(bytes,bytes[])"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    "execute(bytes,bytes[],uint256)"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  "execute(bytes,bytes[])"(
    commands: PromiseOrValue<BytesLike>,
    inputs: PromiseOrValue<BytesLike>[],
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  "execute(bytes,bytes[],uint256)"(
    commands: PromiseOrValue<BytesLike>,
    inputs: PromiseOrValue<BytesLike>[],
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    "execute(bytes,bytes[])"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    "execute(bytes,bytes[],uint256)"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    "execute(bytes,bytes[])"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    "execute(bytes,bytes[],uint256)"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    "execute(bytes,bytes[])"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    "execute(bytes,bytes[],uint256)"(
      commands: PromiseOrValue<BytesLike>,
      inputs: PromiseOrValue<BytesLike>[],
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}