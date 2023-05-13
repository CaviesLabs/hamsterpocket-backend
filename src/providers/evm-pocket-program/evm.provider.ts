import * as ethers from 'ethers';

import { RegistryProvider } from '../registry.provider';
import { ChainID } from '../../pool/entities/pool.entity';

import {
  Multicall3,
  Multicall3__factory,
  PocketChef,
  PocketChef__factory,
  PocketRegistry,
  PocketRegistry__factory,
  PocketVault,
  PocketVault__factory,
} from './libs';
import { Types } from './libs/contracts/PocketRegistry';
import { BigNumber } from 'ethers';

export class EVMBasedPocketProvider {
  private readonly rpcProvider: ethers.providers.JsonRpcProvider;
  private readonly pocketRegistry: PocketRegistry;
  private readonly pocketVault: PocketVault;
  private readonly pocketChef: PocketChef;
  private readonly multicall3: Multicall3;
  private readonly signer: ethers.Wallet;

  /**
   * @dev Constructor that constructs the provider object
   * @param chainId
   */
  constructor(public readonly chainId: ChainID) {
    const registry = new RegistryProvider();
    const {
      RPC_URL,
      OPERATOR_SECRET_KEY,
      POCKET_PROGRAM_ADDRESS,
      POCKET_REGISTRY_PROGRAM_ADDRESS,
      POCKET_VAULT_PROGRAM_ADDRESS,
      MULTICALL3_PROGRAM_ADDRESS,
    } = registry.getConfig().NETWORKS[chainId];

    /**
     * @dev Initializes rpc provider
     */
    this.rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

    /**
     * @dev Initializes variables
     */
    this.signer = new ethers.Wallet(
      OPERATOR_SECRET_KEY as string,
      this.rpcProvider,
    );
    this.multicall3 = Multicall3__factory.connect(
      MULTICALL3_PROGRAM_ADDRESS,
      this.signer,
    );
    this.pocketVault = PocketVault__factory.connect(
      POCKET_VAULT_PROGRAM_ADDRESS,
      this.signer,
    );
    this.pocketRegistry = PocketRegistry__factory.connect(
      POCKET_REGISTRY_PROGRAM_ADDRESS,
      this.signer,
    );
    this.pocketChef = PocketChef__factory.connect(
      POCKET_PROGRAM_ADDRESS,
      this.signer,
    );
  }

  /**
   * @dev Try making DCA swap
   * @param pocketId
   */
  public tryMakingDCASwap(pocketId: string) {
    return this.pocketChef.tryMakingDCASwap(pocketId);
  }

  /**
   * @dev Try closing position
   * @param pocketId
   */
  public tryClosingPosition(pocketId: string) {
    return this.pocketChef.tryClosingPosition(pocketId);
  }

  /**
   * @dev Get quote from blockchain directly
   * @param baseTokenAddress
   * @param targetTokenAddress
   * @param amount
   * @param fee
   */
  public async getQuote(
    baseTokenAddress: string,
    targetTokenAddress: string,
    amount: BigNumber,
    fee: BigNumber,
  ): Promise<{ amountIn: BigNumber; amountOut: BigNumber }> {
    const [amountIn, amountOut] =
      await this.pocketVault.callStatic.getCurrentQuote(
        baseTokenAddress,
        targetTokenAddress,
        amount,
        fee,
      );
    return {
      amountIn,
      amountOut,
    };
  }

  /**
   * @dev Fetch pocket including pocket data and stop conditions
   * @param id
   */
  public async fetchPocket(id: string) {
    const [{ returnData: pocketData }, { returnData: stopConditions }] =
      await this.multicall3.callStatic.aggregate3([
        {
          callData: this.pocketRegistry.interface.encodeFunctionData(
            'pockets',
            [id],
          ),
          target: this.pocketRegistry.address,
          allowFailure: false,
        },
        {
          callData: this.pocketRegistry.interface.encodeFunctionData(
            'getStopConditionsOf',
            [id],
          ),
          target: this.pocketRegistry.address,
          allowFailure: false,
        },
      ]);

    return {
      pocketData: this.pocketRegistry.interface.decodeFunctionResult(
        'pockets',
        pocketData,
      ) as Types.PocketStructOutput,
      stopConditions: this.pocketRegistry.interface.decodeFunctionResult(
        'getStopConditionsOf',
        stopConditions,
      )[0] as Types.StopConditionStructOutput[],
    };
  }

  /**
   * @dev Fetch pocket including pocket data and stop conditions
   * @param idList
   */
  public async fetchMultiplePockets(idList: string[]) {
    const callDataList: Multicall3.Call3Struct[] = [];

    idList.map((pocketId) => {
      callDataList.push({
        callData: this.pocketRegistry.interface.encodeFunctionData('pockets', [
          pocketId,
        ]),
        target: this.pocketRegistry.address,
        allowFailure: false,
      });
      callDataList.push({
        callData: this.pocketRegistry.interface.encodeFunctionData(
          'getStopConditionsOf',
          [pocketId],
        ),
        target: this.pocketRegistry.address,
        allowFailure: false,
      });
    });
    const callResults = await this.multicall3.callStatic.aggregate3(
      callDataList,
    );

    const aggregatedDataList: {
      pocketData: Types.PocketStructOutput;
      stopConditions: Types.StopConditionStructOutput[];
    }[] = [];
    idList.map((id, index) => {
      aggregatedDataList[index] = {
        pocketData: this.pocketRegistry.interface.decodeFunctionResult(
          'pockets',
          callResults[index * 2].returnData,
        ) as Types.PocketStructOutput,
        stopConditions: this.pocketRegistry.interface.decodeFunctionResult(
          'getStopConditionsOf',
          callResults[index * 2 + 1].returnData,
        )[0] as Types.StopConditionStructOutput[],
      };
    });

    return aggregatedDataList;
  }

  /**
   * @dev Get multiple quotes
   * @param payload
   */
  public async getMultipleQuotes(
    payload: {
      baseTokenAddress: string;
      targetTokenAddress: string;
      amount: BigNumber;
      fee: BigNumber;
    }[],
  ): Promise<{ amountIn: BigNumber; amountOut: BigNumber }[]> {
    //  Promise<{amountIn: BigNumber, amountOut: BigNumber}[]>
    const callData = payload.map(
      ({ fee, baseTokenAddress, targetTokenAddress, amount }) => ({
        callData: this.pocketVault.interface.encodeFunctionData(
          'getCurrentQuote',
          [
            baseTokenAddress || ethers.constants.AddressZero,
            targetTokenAddress || ethers.constants.AddressZero,
            amount,
            fee,
          ],
        ),
        target: this.pocketVault.address,
        allowFailure: true,
      }),
    );

    const callResults = await this.multicall3.callStatic.aggregate3(callData);

    return callResults.map((result, index) => {
      /**
       * @dev In case any errors happened
       */
      if (result.success === false) {
        return {
          amountIn: payload[index].amount,
          amountOut: BigNumber.from(0),
        };
      }

      const [amountIn, amountOut] =
        this.pocketVault.interface.decodeFunctionResult(
          'getCurrentQuote',
          result.returnData,
        );
      return {
        amountIn,
        amountOut,
      };
    });
  }

  /**
   * @dev Fetch events
   * @param fromBlock
   * @param blockDiff
   */
  public async fetchEvents(fromBlock: number, blockDiff: number) {
    const provider = this.rpcProvider;
    const currentBlock = await provider.getBlockNumber();
    const desiredMaxBlock =
      currentBlock > fromBlock + blockDiff
        ? fromBlock + blockDiff
        : currentBlock;

    const expectedEvents = [
      'PocketUpdated',
      'PocketInitialized',
      'Deposited',
      'Withdrawn',
      'Swapped',
      'ClosedPosition',
    ];

    const registryLogs = await Promise.all(
      (
        await provider.getLogs({
          address: this.pocketRegistry.address,
          fromBlock, // default is limited to 5000 block
          toBlock: desiredMaxBlock,
        })
      ).map(async (log) => {
        let extraData;

        try {
          extraData = this.pocketRegistry.interface.parseLog(log);
        } catch {}

        return {
          transactionHash: log.transactionHash,
          ...extraData,
        };
      }),
    );

    const vaultLogs = await Promise.all(
      (
        await provider.getLogs({
          address: this.pocketVault.address,
          fromBlock, // default is limited to 5000 block
          toBlock: desiredMaxBlock,
        })
      ).map(async (log) => {
        let extraData;

        try {
          extraData = this.pocketVault.interface.parseLog(log);
        } catch {}

        return {
          transactionHash: log.transactionHash,
          ...extraData,
        };
      }),
    );

    return {
      data: registryLogs
        .concat(vaultLogs)
        .filter((log) => expectedEvents.includes(log.name)),
      syncedBlock: desiredMaxBlock,
    };
  }
}
