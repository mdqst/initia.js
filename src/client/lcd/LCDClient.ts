import { APIRequester } from './APIRequester';
import {
  AuthAPI,
  AuthzAPI,
  BankAPI,
  BuilderAPI,
  DistributionAPI,
  FeeGrantAPI,
  GovAPI,
  GroupAPI,
  IbcAPI,
  IbcNftAPI,
  IbcSftAPI,
  IbcTransferAPI,
  InterTxAPI,
  MoveAPI,
  MstakingAPI,
  RewardAPI,
  SlashingAPI,
  TendermintAPI,
  TxAPI,
  UpgradeAPI,
} from './api';
import { Wallet } from './Wallet';
import { Coins } from '../../core';
import { Key } from '../../key';

export interface LCDClientConfig {
  /**
   * Chain ID of the blockchain to connect to.
   */
  chainId?: string;

  /**
   * Coins representing the default gas prices to use for fee estimation.
   */
  gasPrices?: Coins.Input;

  /**
   * Number presenting the default gas adjustment value to use for fee estimation.
   */
  gasAdjustment?: string;
}

const DEFAULT_LCD_OPTIONS: Partial<LCDClientConfig> = {
  gasAdjustment: '1.75',
};

const DEFAULT_GAS_PRICES_BY_CHAIN_ID: { [key: string]: Coins.Input } = {
  default: {
    uinit: 0.15,
  },
};

/**
 * An object repesenting a connection to a initiad node running the Lite Client Daemon (LCD)
 * server, a REST server providing access to a node.
 *
 * ### Example
 *
 * ```ts
 * import { LCDClient } from 'initia.js';
 *
 * const initia = new LCDClient("https://stone-rest.initia.tech", {
 *    chainId: "testnet"
 * });
 * ```
 */

export class LCDClient {
  public URL: string;
  public config: LCDClientConfig;
  public apiRequester: APIRequester;

  // API access
  public auth: AuthAPI;
  public authz: AuthzAPI;
  public bank: BankAPI;
  public builder: BuilderAPI;
  public distribution: DistributionAPI;
  public feeGrant: FeeGrantAPI;
  public gov: GovAPI;
  public group: GroupAPI;
  public ibc: IbcAPI;
  public ibcNft: IbcNftAPI;
  public ibcSft: IbcSftAPI;
  public ibcTransfer: IbcTransferAPI;
  public interTx: InterTxAPI;
  public move: MoveAPI;
  public mstaking: MstakingAPI;
  public reward: RewardAPI;
  public slashing: SlashingAPI;
  public tendermint: TendermintAPI;
  public tx: TxAPI;
  public upgrade: UpgradeAPI;

  /**
   * Creates a new LCD client with the specified configuration.
   *
   * @param config LCD configuration
   */
  constructor(
    URL: string,
    config?: LCDClientConfig,
    apiRequester?: APIRequester
  ) {
    this.URL = URL;
    this.config = {
      ...DEFAULT_LCD_OPTIONS,
      gasPrices:
        (config?.chainId && DEFAULT_GAS_PRICES_BY_CHAIN_ID[config.chainId]) ??
        DEFAULT_GAS_PRICES_BY_CHAIN_ID['default'],
      ...config,
    };
    this.apiRequester = apiRequester ?? new APIRequester(this.URL);

    // instantiate APIs
    this.auth = new AuthAPI(this.apiRequester);
    this.authz = new AuthzAPI(this.apiRequester);
    this.bank = new BankAPI(this.apiRequester);
    this.builder = new BuilderAPI(this.apiRequester);
    this.distribution = new DistributionAPI(this.apiRequester);
    this.feeGrant = new FeeGrantAPI(this.apiRequester);
    this.gov = new GovAPI(this.apiRequester);
    this.group = new GroupAPI(this.apiRequester);
    this.ibc = new IbcAPI(this.apiRequester);
    this.ibcNft = new IbcNftAPI(this.apiRequester);
    this.ibcSft = new IbcSftAPI(this.apiRequester);
    this.ibcTransfer = new IbcTransferAPI(this.apiRequester);
    this.interTx = new InterTxAPI(this.apiRequester);
    this.move = new MoveAPI(this.apiRequester);
    this.mstaking = new MstakingAPI(this.apiRequester);
    this.reward = new RewardAPI(this.apiRequester);
    this.slashing = new SlashingAPI(this.apiRequester);
    this.tendermint = new TendermintAPI(this.apiRequester);
    this.tx = new TxAPI(this);
    this.upgrade = new UpgradeAPI(this.apiRequester);
  }

  /** Creates a new wallet with the Key. */
  public wallet(key: Key): Wallet {
    return new Wallet(this, key);
  }
}
