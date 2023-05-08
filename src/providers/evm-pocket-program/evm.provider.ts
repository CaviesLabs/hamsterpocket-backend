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

export class EVMBasedPocketProvider {
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
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

    /**
     * @dev Initializes variables
     */
    this.signer = new ethers.Wallet(OPERATOR_SECRET_KEY as string, rpcProvider);
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
   * @dev Fetch events
   * @param fromBlock
   */
  public async fetchEvents(fromBlock: number) {
    const provider = await this.pocketRegistry.provider;

    const pocketLogs = await Promise.all(
      (
        await provider.getLogs({
          address: this.pocketRegistry.address,
          fromBlock, // default is limited to 5000 block
          toBlock: fromBlock + 5000,
          topics: [
            this.pocketRegistry.interface.events[
              'PocketInitialized(address,string,address,tuple)'
            ].format(),
            this.pocketRegistry.interface.events[
              'PocketUpdated(address,string,address,string,tuple)'
            ].format(),
          ],
        })
      ).map(async (log) => ({
        timestamp: (await provider.getBlock(log.blockHash)).timestamp,
        transactionHash: log.transactionHash,
        ...this.pocketRegistry.interface.parseLog(log),
      })),
    );

    const vaultLogs = await Promise.all(
      (
        await provider.getLogs({
          address: this.pocketVault.address,
          fromBlock,
          toBlock: fromBlock + 5000,
          topics: [
            this.pocketVault.interface.events[
              'Deposited(address,string,address,uint256)'
            ].format(),
            this.pocketVault.interface.events[
              'Withdrawn(address,string,address,uint256,address,uint256)'
            ].format(),
            this.pocketVault.interface.events[
              'Swapped(address,string,address,uint256,address,uint256)'
            ].format(),
            this.pocketVault.interface.events[
              'ClosedPosition(address,string,address,uint256,address,uint256)'
            ].format(),
          ],
        })
      ).map(async (log) => ({
        timestamp: (await provider.getBlock(log.blockHash)).timestamp,
        transactionHash: log.transactionHash,
        ...this.pocketVault.interface.parseLog(log),
      })),
    );

    return {
      data: pocketLogs.concat(vaultLogs),
      nextBlock: fromBlock + 5001,
    };
  }
}
