import axios from 'axios';
import { ALCHEMY_API_KEY, ETHERSCAN_API_KEY, INFURA_API_KEY, IS_MAINNET, NETWORK, PRIVATE_RPC_URL, RPC_PASSWORD, RPC_URL, RPC_USER } from '@config';
import { isArray } from 'class-validator';
import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';

export interface EtherscanAccount {
  account: string;
  balance: string;
}

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export interface TokenContractData {
  address: string;
  type: string;
  name: string;
  symbol: string;
}

class EthereumService {
  public etherscanUrl = `https://api${IS_MAINNET ? '' : '-' + NETWORK}.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`;
  // only available on mainnet
  public rpcUrl = `https://${RPC_USER}:${RPC_PASSWORD}@${RPC_URL}`;
  // used to avoid sandwich attacks only available on mainnet
  public privateRpcUrl = `https://${PRIVATE_RPC_URL}`;

  // Optional config object, but defaults to the API key 'demo' and Network 'eth-mainnet'.
  private alchemyClient = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    network: IS_MAINNET ? Network.ETH_MAINNET : Network.ETH_GOERLI,
  });

  private ethersPrivateProvider = new ethers.providers.JsonRpcProvider(this.privateRpcUrl);

  public async getAccountBalance(account: string): Promise<EtherscanAccount> {
    const a = await this.alchemyClient.core.getBalance(account);
    const balance = ethers.utils.formatEther(a);
    return { account, balance };
  }

  public async getTransactions(account: string): Promise<EtherscanTransaction[]> {
    const module = 'account';
    const action = 'txlist';
    const startblock = 0;
    const endBlock = 'latest';
    const page = 1;
    const offset = 50;
    const sort = 'desc';
    const url = `${this.etherscanUrl}&module=${module}&action=${action}&address=${account}&startblock=${startblock}&endBlock=${endBlock}&page=${page}&offset=${offset}&sort=${sort}`;
    return await this.makeTransactionRequest(url, page, offset);
  }

  private async makeTransactionRequest(url, page, offset): Promise<EtherscanTransaction[]> {
    let url_ = url;
    let isComplete = false;
    const txs: EtherscanTransaction[] = [];
    while (!isComplete) {
      const a = await axios.get(url_);
      if (a.data.result && isArray(a.data.result)) {
        a.data.result.forEach(tx => {
          txs.push({ ...tx });
        });
        console.log('ethereum txs len', a.data.result.length);
        console.log('ethereum txs offset', offset);
        isComplete = a.data.result.length < offset;
        if (!isComplete) {
          const newPage = +page + 1;
          url_ = url_.replace(`page=${page}`, `page=${newPage}`);
          page = newPage;
        }
      } else {
        isComplete = true;
      }
    }
    return txs;
  }

  // public async scrapTokenContractData(address: string): Promise<TokenContractData> {
  //
  // }
}

export default EthereumService;
